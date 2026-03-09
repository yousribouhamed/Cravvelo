import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "database/src";
import { clerkClient } from "@clerk/nextjs/server";
import { ChargilyWebhookEvent } from "@/src/modules/payments/types";
import { pusherServer } from "@/src/lib/pusher";
import {
  sendSubscriptionSuccessEmail,
  sendSubscriptionFailedEmail,
} from "@/src/lib/resend";

const apiSecretKey =
  process.env.CHARGILY_SECRET_KEY ||
  "test_sk_Fje5EhFwyGTGqk4M6et3Jxxxxxxxxxxxxxxxxxxxx";

const PUSHER_NOTIFICATION_EVENT = "incomming-notifications";

type MetadataItem = {
  accountId?: string;
  plan?: string;
  billingCycle?: string;
  paymentId?: string;
};

function extractMetadata(event: ChargilyWebhookEvent): MetadataItem | null {
  const raw = event.data?.metadata;
  if (Array.isArray(raw) && raw[0] && typeof raw[0] === "object") {
    return raw[0] as MetadataItem;
  }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as MetadataItem;
  }
  return null;
}

async function getUserEmailForAccount(accountId: string): Promise<string | null> {
  try {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      select: { userId: true, support_email: true },
    });
    if (!account) return null;
    if (account.support_email) return account.support_email;
    const user = await clerkClient.users.getUser(account.userId);
    const primary = user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId);
    return primary?.emailAddress ?? null;
  } catch (e) {
    console.error("getUserEmailForAccount error:", e);
    return null;
  }
}

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
    const meta = extractMetadata(event);

    if (!meta?.paymentId) {
      return NextResponse.json(
        { error: "Missing paymentId in metadata" },
        { status: 400 }
      );
    }

    const accountId = meta.accountId ?? null;
    const planCode = meta.plan ?? null;
    const billingCycle = meta.billingCycle ?? "MONTHLY";

    switch (event.type) {
      case "checkout.paid": {
        if (!accountId || !planCode) {
          return NextResponse.json(
            { error: "Missing accountId or plan in metadata" },
            { status: 400 }
          );
        }
        await handleCheckoutPaid({
          paymentId: meta.paymentId,
          accountId,
          planCode,
          billingCycle,
          chargilyCheckoutId: event.data?.id ?? null,
        });
        break;
      }

      case "checkout.failed": {
        await handleCheckoutFailed(meta.paymentId, accountId);
        break;
      }

      default:
        console.log("⚠️ Unknown event type:", event.type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook upgrade processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleCheckoutPaid({
  paymentId,
  accountId,
  planCode,
  billingCycle,
  chargilyCheckoutId,
}: {
  paymentId: string;
  accountId: string;
  planCode: string;
  billingCycle: string;
  chargilyCheckoutId: string | null;
}) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { Account: true },
  });

  if (!payment) {
    console.error("⚠️ Payment not found:", paymentId);
    return;
  }

  if (payment.status !== "PENDING") {
    console.log(`Payment ${paymentId} already processed (${payment.status}), skipping`);
    return;
  }

  const now = new Date();
  const isYearly = billingCycle === "YEARLY";
  const periodEnd = new Date(now);
  if (isYearly) {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "COMPLETED" },
  });

  const existing = await prisma.accountSubscription.findFirst({
    where: { accountId },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    await prisma.accountSubscription.update({
      where: { id: existing.id },
      data: {
        planCode,
        billingCycle: isYearly ? "YEARLY" : "MONTHLY",
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        chargilyCheckoutId,
        paymentId,
      },
    });
  } else {
    await prisma.accountSubscription.create({
      data: {
        accountId,
        planCode,
        billingCycle: isYearly ? "YEARLY" : "MONTHLY",
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        chargilyCheckoutId,
        paymentId,
      },
    });
  }

  const notification = await prisma.notification.create({
    data: {
      accountId,
      type: "SUCCESS",
      title: "Subscription activated",
      content: `Your subscription (${planCode}) is now active.`,
      actionUrl: "/settings/subscription",
      metadata: { planCode, billingCycle, paymentId },
    },
  });

  if (pusherServer) {
    try {
      await pusherServer.trigger(accountId, PUSHER_NOTIFICATION_EVENT, {
        id: notification.id,
      });
    } catch (err) {
      console.error("Pusher trigger error:", err);
    }
  }

  const email = await getUserEmailForAccount(accountId);
  if (email) {
    await sendSubscriptionSuccessEmail({
      email,
      planName: planCode,
      periodEnd: periodEnd.toISOString().split("T")[0],
    });
  }

  console.log(`✅ Subscription activated for account ${accountId}, payment ${paymentId}`);
}

async function handleCheckoutFailed(
  paymentId: string,
  accountId: string | null
) {
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

  const idForNotification = accountId ?? payment.accountId;
  if (idForNotification) {
    const notification = await prisma.notification.create({
      data: {
        accountId: idForNotification,
        type: "ERROR",
        title: "Subscription payment failed",
        content: "Your subscription payment could not be completed.",
        actionUrl: "/settings/subscription",
        metadata: { paymentId },
      },
    });

    if (pusherServer) {
      try {
        await pusherServer.trigger(
          idForNotification,
          PUSHER_NOTIFICATION_EVENT,
          { id: notification.id }
        );
      } catch (err) {
        console.error("Pusher trigger error:", err);
      }
    }

    const email = await getUserEmailForAccount(idForNotification);
    if (email) {
      await sendSubscriptionFailedEmail({ email });
    }
  }

  console.log(`❌ Payment ${paymentId} marked as FAILED`);
}
