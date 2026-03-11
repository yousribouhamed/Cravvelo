"use server";

import { withTenant } from "@/_internals/with-tenant";
import type { ChargilyApiResponse } from "../types";
import z from "zod";
import { getCurrentUser } from "@/modules/auth/lib/utils";
import { triggerNotificationEvent } from "@/lib/notify";

const CHARGILY_LIVE_CHECKOUT_URL = "https://pay.chargily.net/api/v2/checkouts";
const CHARGILY_TEST_CHECKOUT_URL =
  "https://pay.chargily.net/test/api/v2/checkouts";

function normalizeChargilyConfig(config: unknown): { secretKey?: string } {
  // `PaymentMethodConfig.config` is Prisma `Json`, but some code stores it as a stringified JSON.
  // Handle both shapes safely.
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
    const obj = config as any;
    return { secretKey: obj?.secretKey };
  }

  return {};
}

function getChargilyCheckoutBaseUrl(secretKey: string) {
  // Chargily keys typically look like `test_sk_...` for test mode.
  // Selecting the endpoint based on the key avoids common prod/dev mismatches.
  const isTestKey = secretKey.startsWith("test_") || secretKey.startsWith("test_sk_");
  return isTestKey ? CHARGILY_TEST_CHECKOUT_URL : CHARGILY_LIVE_CHECKOUT_URL;
}

export const createChargilyCheckout = withTenant({
  input: z.object({
    totalPrice: z.string(),
    paymentId: z.string(),
  }),
  handler: async ({ tenant, website, input, accountId, db }) => {
    try {
      const tenantCurrency = (website?.currency || "DZD").toLowerCase();
      const amount = Math.round(Number(input.totalPrice));
      const payload = {
        amount,
        currency: tenantCurrency,
        payment_method: "EDAHABIA",
        success_url: `https://${tenant}.cravvelo.com/payments/success`,
        failure_url: `https://${tenant}.cravvelo.com/payments/failure`,
        webhook_endpoint: `https://${tenant}.cravvelo.com/api/webhooks/chargily`,
        metadata: [{ paymentId: input.paymentId }],
        description: `Payment for order ${input.paymentId}`,
        locale: "ar",
      };

      const connection = await db.paymentMethodConfig.findFirst({
        where: { accountId, provider: "CHARGILY", isActive: true },
        select: { config: true },
      });

      const configuredSecretKey = normalizeChargilyConfig(connection?.config)
        ?.secretKey;
      const secretKey = configuredSecretKey || process.env.CHARGILY_SECRET_KEY;

      if (!secretKey) {
        throw new Error(
          "Chargily is not configured: missing secret key. Set `CHARGILY_SECRET_KEY` or connect Chargily in the dashboard for this tenant."
        );
      }

      const baseUrl = getChargilyCheckoutBaseUrl(secretKey);

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(
          `Chargily API error: ${response.status} ${response.statusText} - ${errText}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        message: "Checkout created successfully",
        data: data as ChargilyApiResponse,
      };
    } catch (error) {
      console.error("Failed to create Chargily checkout:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create checkout",
        data: null,
      };
    }
  },
});

export const createChargilyPaymentIntent = withTenant({
  input: z.object({
    productId: z.string(),
    type: z.enum(["COURSE", "PRODUCT"]),
  }),

  handler: async ({ accountId, tenant, website, input, db }) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const tenantCurrency = website?.currency || "DZD";

    const result = await db.$transaction(async (tx) => {
      // 1. Fetch the item (course or product)
      let item: any = null;
      let pricingPlan: any = null;

      if (input.type === "COURSE") {
        item = await tx.course.findUnique({
          where: { id: input.productId },
          include: { CoursePricingPlans: { include: { PricingPlan: true } } },
        });
        if (!item) throw new Error("Course not found");

        pricingPlan =
          item.CoursePricingPlans.find(
            (p: { isDefault: any }) => p.isDefault
          ) ?? item.CoursePricingPlans[0];
      } else {
        item = await tx.product.findUnique({
          where: { id: input.productId },
          include: { ProductPricingPlans: { include: { PricingPlan: true } } },
        });
        if (!item) throw new Error("Product not found");

        pricingPlan =
          item.ProductPricingPlans.find(
            (p: { isDefault: any }) => p.isDefault
          ) ?? item.ProductPricingPlans[0];
      }

      if (!pricingPlan?.PricingPlan)
        throw new Error("No active pricing plan found");

      const price = pricingPlan.PricingPlan.price ?? 0;

      // 2. Create Sale
      const sale = await tx.sale.create({
        data: {
          accountId,
          studentId: user.userId,
          amount: price,
          originalAmount: price,
          status: "CREATED",
          itemType: input.type,
          itemId: item.id,
          price,
          courseId: input.type === "COURSE" ? item.id : null,
          productId: input.type === "PRODUCT" ? item.id : null,
        },
      });

      // 3. Create Payment (status PENDING)
      const payment = await tx.payment.create({
        data: {
          type: input.type === "COURSE" ? "BUYCOURSE" : "BUYPRODUCT",
          amount: price,
          status: "PENDING",
          currency: tenantCurrency,
          method: "CHARGILY",
          studentId: user.userId,
          accountId,
          saleId: sale.id,
          description: `${input.type} purchase: ${item.title}`,
        },
      });

      // Store-owner notification (dashboard) - sale intent created
      const notification = await tx.notification.create({
        data: {
          accountId,
          type: "INFO",
          title: "New sale",
          content: "A new sale was created.",
          actionUrl: "/payments",
          metadata: {
            source: "academia",
            i18nKey: "notifications.events.sale_created",
            values: {
              method: "CHARGILY",
              itemTitle: item.title,
              amount: price,
              currency: tenantCurrency,
              itemType: input.type,
            },
            entity: {
              saleId: sale.id,
              paymentId: payment.id,
              itemId: item.id,
            },
          },
        },
      });

      const checkout = await createChargilyCheckout({
        totalPrice: price.toString(),
        paymentId: payment.id,
      });

      if (!checkout.data?.checkout_url)
        throw new Error("Failed to create Chargily checkout");

      // Trigger realtime after we know we’re returning success
      return {
        success: true,
        checkoutUrl: checkout.data?.checkout_url,
        paymentId: payment.id,
        saleId: sale.id,
        notificationId: notification.id,
      };
    });

    if (result?.success && result.notificationId) {
      await triggerNotificationEvent({
        accountId,
        payload: { id: result.notificationId, type: "sale_created" },
      });
    }

    // Do not leak internal notificationId to clients unless needed.
    // We keep it internal for realtime only.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { notificationId, ...publicResult } = result as any;
    return publicResult;
  },
});
