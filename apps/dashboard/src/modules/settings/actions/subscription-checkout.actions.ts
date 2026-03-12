"use server";

import { withAuth } from "@/src/_internals/with-auth";
import type { ChargilyApiResponse } from "@/src/modules/payments/types";
import { SUBSCRIPTION_PLANS } from "@/src/constants/subscription-plans";
import { resolveCanonicalDashboardBaseUrl } from "@/src/lib/canonical-url";
import z from "zod";

function getChargilyCheckoutUrl() {
  const key = process.env.CHARGILY_SECRET_KEY ?? "";
  const isTestKey = key.startsWith("test_");
  return isTestKey
    ? "https://pay.chargily.net/test/api/v2/checkouts"
    : "https://pay.chargily.net/api/v2/checkouts";
}

export const createSubscriptionCheckout = withAuth({
  input: z.object({
    planCode: z.enum(["BASIC", "STARTER", "GROWTH", "SCALE"]),
    billingCycle: z.enum(["MONTHLY", "YEARLY"]),
  }),
  handler: async ({ account, input, db }) => {
    const appBaseUrl = resolveCanonicalDashboardBaseUrl();
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
      success_url: `${appBaseUrl}/settings/subscription?success=1`,
      failure_url: `${appBaseUrl}/settings/subscription?failed=1`,
      webhook_endpoint: `${appBaseUrl}/api/webhooks/chargily/upgrade`,
      metadata,
      description: `Subscription ${plan.name} - ${input.billingCycle}`,
      locale: "ar",
    };

    console.info("Chargily subscription checkout base URL:", appBaseUrl);

    try {
      const response = await fetch(getChargilyCheckoutUrl(), {
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
