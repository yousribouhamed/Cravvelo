"use server";

import { withAuth } from "@/src/_internals/with-auth";
import type { ChargilyApiResponse } from "@/src/modules/payments/types";
import { SUBSCRIPTION_PLANS } from "@/src/constants/subscription-plans";
import z from "zod";

const CHARGILY_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://pay.chargily.net/test/api/v2/checkouts"
    : "https://pay.chargily.net/api/v2/checkouts";

const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://app.cravvelo.com");

export const createSubscriptionCheckout = withAuth({
  input: z.object({
    planCode: z.enum(["BASIC", "STARTER", "GROWTH", "SCALE"]),
    billingCycle: z.enum(["MONTHLY", "YEARLY"]),
  }),
  handler: async ({ account, input, db }) => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.planCode === input.planCode);
    if (!plan) {
      return { success: false, checkoutUrl: null, error: "Invalid plan" };
    }

    const amount =
      input.billingCycle === "MONTHLY" ? plan.priceMonthly : plan.priceYearly;

    const payment = await db.payment.create({
      data: {
        type: "SUBSCRIPTION",
        amount,
        currency: "DZD",
        status: "PENDING",
        method: "CHARGILY",
        accountId: account.id,
        description: `Subscription: ${plan.name} (${input.billingCycle})`,
        metadata: {
          planCode: input.planCode,
          billingCycle: input.billingCycle,
        },
      },
    });

    const metadata = [
      {
        accountId: account.id,
        plan: input.planCode,
        billingCycle: input.billingCycle,
        paymentId: payment.id,
      },
    ];

    const payload = {
      amount: Math.round(amount),
      currency: "dzd",
      payment_method: "EDAHABIA",
      success_url: `${APP_BASE_URL}/settings/subscription?success=1`,
      failure_url: `${APP_BASE_URL}/settings/subscription?failed=1`,
      webhook_endpoint: `${APP_BASE_URL}/api/webhooks/chargily/upgrade`,
      metadata,
      description: `Subscription ${plan.name} - ${input.billingCycle}`,
      locale: "ar",
    };

    try {
      const response = await fetch(CHARGILY_BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Chargily subscription checkout error:", errText);
        return {
          success: false,
          checkoutUrl: null,
          error: "Failed to create checkout",
        };
      }

      const data = (await response.json()) as ChargilyApiResponse;
      const checkoutUrl = data.checkout_url ?? null;

      if (!checkoutUrl) {
        return {
          success: false,
          checkoutUrl: null,
          error: "No checkout URL returned",
        };
      }

      return {
        success: true,
        checkoutUrl,
        error: null,
      };
    } catch (error) {
      console.error("Subscription checkout error:", error);
      return {
        success: false,
        checkoutUrl: null,
        error: "Failed to create checkout",
      };
    }
  },
});
