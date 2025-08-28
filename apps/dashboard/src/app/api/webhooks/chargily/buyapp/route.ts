import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "database/src";
import { ChargilyWebhookEvent } from "@/src/modules/payments/types";

const apiSecretKey =
  process.env.CHARGILY_SECRET_KEY ||
  "test_sk_Fje5EhFwyGTGqk4M6et3Jxxxxxxxxxxxxxxxxxxxx";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("signature");
    const body = await request.text();

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const computedSignature = crypto
      .createHmac("sha256", apiSecretKey)
      .update(body)
      .digest("hex");

    if (computedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const event: ChargilyWebhookEvent = JSON.parse(body);

    switch (event.type) {
      case "checkout.paid": {
        const paymentId = event.data.metadata?.[0]?.paymentId;
        if (!paymentId) throw new Error("Missing paymentId in metadata");
        await handleSuccessfulPayment(paymentId, event);
        break;
      }

      case "checkout.failed": {
        const paymentId = event.data.metadata?.[0]?.paymentId;
        if (!paymentId) throw new Error("Missing paymentId in metadata");
        await handleFailedPayment(paymentId);
        break;
      }

      default:
        console.log("⚠️ Unknown event type:", event.type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(
  paymentId: string,
  event: ChargilyWebhookEvent
) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { Sale: true, AppInstall: true, Account: true },
    });

    if (!payment) {
      console.error("⚠️ Payment not found:", paymentId);
      return;
    }

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "COMPLETED",
      },
    });

    await prisma.invoice.updateMany({
      where: {
        paymentId,
      },
      data: {
        status: "COMPLETED",
        paidAt: new Date(),
      },
    });

    console.log(`✅ Payment ${paymentId} marked as COMPLETED`);
  } catch (error) {
    console.error("❌ Error handling successful payment:", error);
    throw error;
  }
}

async function handleFailedPayment(paymentId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      console.error("⚠️ Payment not found:", paymentId);
      return;
    }

    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "FAILED" },
    });

    await prisma.invoice.updateMany({
      where: { paymentId },
      data: { status: "FAILED" },
    });
    console.log(`❌ Payment ${paymentId} marked as FAILED`);
  } catch (error) {
    console.error("❌ Error handling failed payment:", error);
    throw error;
  }
}
