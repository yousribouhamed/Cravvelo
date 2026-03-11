import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  ChargilyWebhookEvent,
} from "@/modules/payments/types";
import { prisma } from "database/src";
import { PurchaseStatus } from "@prisma/client";

function normalizeChargilyConfig(config: unknown): { secretKey?: string } {
  if (!config) return {};
  if (typeof config === "string") {
    try {
      const parsed = JSON.parse(config) as any;
      return { secretKey: parsed?.secretKey };
    } catch {
      return {};
    }
  }
  if (typeof config === "object") {
    return { secretKey: (config as any)?.secretKey };
  }
  return {};
}

async function resolveSecretKey(host: string | null): Promise<string | null> {
  const subdomain = host?.split(".")?.[0];
  if (subdomain) {
    const fullDomain = `${subdomain}.cravvelo.com`;
    const website = await prisma.website.findUnique({
      where: { subdomain: fullDomain },
      select: { accountId: true },
    });
    if (website) {
      const connection = await prisma.paymentMethodConfig.findFirst({
        where: { accountId: website.accountId, provider: "CHARGILY", isActive: true },
        select: { config: true },
      });
      const tenantKey = normalizeChargilyConfig(connection?.config)?.secretKey;
      if (tenantKey) return tenantKey;
    }
  }
  return process.env.CHARGILY_SECRET_KEY || null;
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("signature");
    const body = await request.text();

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const host = request.headers.get("host");
    const apiSecretKey = await resolveSecretKey(host);

    if (!apiSecretKey) {
      console.error("Chargily webhook: no secret key configured for host:", host);
      return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });
    }

    const computedSignature = crypto
      .createHmac("sha256", apiSecretKey)
      .update(body)
      .digest("hex");

    if (computedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    // Parse the JSON payload
    const event: ChargilyWebhookEvent = JSON.parse(body);

    // Switch based on the event type
    switch (event.type) {
      case "checkout.paid": {
        const paymentId = extractPaymentId(event);
        if (!paymentId) {
          return NextResponse.json(
            { error: "Missing paymentId in metadata" },
            { status: 400 }
          );
        }
        await handleSuccessfulPayment(paymentId);
        break;
      }

      case "checkout.failed": {
        const paymentId = extractPaymentId(event);
        if (!paymentId) {
          return NextResponse.json(
            { error: "Missing paymentId in metadata" },
            { status: 400 }
          );
        }
        await handleFailedPayment(paymentId);
        break;
      }

      default:
        console.log("Unknown event type:", event.type);
    }

    // Respond with a 200 OK status code
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function extractPaymentId(event: ChargilyWebhookEvent): string | null {
  const metadata: any = (event as any)?.data?.metadata;
  // Chargily commonly sends metadata as an array of objects.
  const fromArray = Array.isArray(metadata) ? metadata?.[0]?.paymentId : null;
  const fromObject = !Array.isArray(metadata) ? metadata?.paymentId : null;
  return (fromArray || fromObject || null) as string | null;
}

async function handleSuccessfulPayment(paymentId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { Sale: true, Student: true },
    });

    if (!payment) {
      console.error("Payment not found:", paymentId);
      return;
    }

    if (!payment.Sale) {
      console.error("Payment has no sale:", paymentId);
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: "COMPLETED" },
      });
      return;
    }

    const sale = payment.Sale;

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: { status: "COMPLETED" },
      });

      await tx.sale.update({
        where: { id: sale.id },
        data: { status: "COMPLETED" },
      });

      // Grant access by creating ItemPurchase (idempotent)
      if (!payment.Student) return;

      const existingPurchase = await tx.itemPurchase.findFirst({
        where: {
          studentId: payment.Student.id,
          itemType: sale.itemType,
          itemId: sale.itemId,
          status: PurchaseStatus.ACTIVE,
        },
      });
      if (existingPurchase) return;

      // Resolve default pricing plan for this item
      let plan: any = null;

      if (sale.itemType === "COURSE") {
        const course = await tx.course.findUnique({
          where: { id: sale.itemId },
          include: {
            CoursePricingPlans: { include: { PricingPlan: true } },
          },
        });
        const pricingPlan =
          course?.CoursePricingPlans?.find((p: any) => p.isDefault) ??
          course?.CoursePricingPlans?.[0];
        plan = pricingPlan?.PricingPlan ?? null;
      }

      if (sale.itemType === "PRODUCT") {
        const product = await tx.product.findUnique({
          where: { id: sale.itemId },
          include: {
            ProductPricingPlans: { include: { PricingPlan: true } },
          },
        });
        const pricingPlan =
          product?.ProductPricingPlans?.find((p: any) => p.isDefault) ??
          product?.ProductPricingPlans?.[0];
        plan = pricingPlan?.PricingPlan ?? null;
      }

      if (!plan?.id) {
        console.warn("No pricing plan found for sale:", sale.id);
        return;
      }

      const accessStartDate = new Date();
      let accessEndDate: Date | null = null;

      if (plan.pricingType === "RECURRING" && plan.recurringDays) {
        accessEndDate = new Date(accessStartDate);
        accessEndDate.setDate(accessEndDate.getDate() + plan.recurringDays);
      } else if (
        plan.pricingType === "ONE_TIME" &&
        plan.accessDuration === "LIMITED" &&
        plan.accessDurationDays
      ) {
        accessEndDate = new Date(accessStartDate);
        accessEndDate.setDate(accessEndDate.getDate() + plan.accessDurationDays);
      }

      await tx.itemPurchase.create({
        data: {
          studentId: payment.Student.id,
          accountId: sale.accountId,
          pricingPlanId: plan.id,
          itemType: sale.itemType,
          itemId: sale.itemId,
          purchaseAmount: payment.amount,
          currency: payment.currency || "DZD",
          status: PurchaseStatus.ACTIVE,
          accessStartDate,
          accessEndDate,
          nextBillingDate:
            plan.pricingType === "RECURRING" && plan.recurringDays
              ? (() => {
                  const next = new Date(accessStartDate);
                  next.setDate(next.getDate() + plan.recurringDays);
                  return next;
                })()
              : null,
        },
      });
    });
  } catch (error) {
    console.error("Error handling successful payment:", error);
    throw error;
  }
}

async function handleFailedPayment(paymentId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { Sale: true },
    });

    if (!payment) {
      console.error("Payment not found:", paymentId);
      return;
    }

    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "FAILED" },
    });

    if (payment.Sale) {
      await prisma.sale.update({
        where: { id: payment.Sale.id },
        data: { status: "CANCELLED" },
      });
    }
  } catch (error) {
    console.error("Error handling failed payment:", error);
    throw error;
  }
}

// Optional: Export types for use in other parts of your application
export type { ChargilyWebhookEvent };
