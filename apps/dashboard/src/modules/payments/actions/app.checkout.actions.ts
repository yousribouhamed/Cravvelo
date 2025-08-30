"use server";

import { withAuth } from "@/src/_internals/with-auth";
import type { ChargilyApiResponse } from "../types";
import z from "zod";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://pay.chargily.net/test/api/v2/checkouts"
    : "https://pay.chargily.net/api/v2/checkouts";

export const createChargilyCheckout = withAuth({
  input: z.object({
    totalPrice: z.string(),
    paymentId: z.string(),
  }),
  handler: async ({ input }) => {
    try {
      const amount = Math.round(Number(input.totalPrice) * 1); // convert DZD → centimes
      const payload = {
        amount,
        currency: "dzd",
        payment_method: "EDAHABIA",
        success_url: `https://app.cravvelo.com/checkout/success`,
        failure_url: `https://app.cravvelo.com/checkout/failure`,
        webhook_endpoint: `https://app.cravvelo.com/api/webhooks/chargily/buyapp`,
        metadata: [{ paymentId: input.paymentId }],
        description: `Payment for order ${input.paymentId}`,
        locale: "ar",
      };

      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY!}`,
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
        message: "Failed to create checkout",
        data: null,
      };
    }
  },
});

export const generateChargilyCheckoutLink = withAuth({
  input: z.object({
    paymentId: z.string(),
  }),
  handler: async ({ db, input }) => {
    try {
      const payment = await db.payment.findFirst({
        where: {
          id: input.paymentId,
        },
      });

      const checkout = await createChargilyCheckout({
        paymentId: input.paymentId,
        totalPrice: payment.amount.toString(),
      });

      return checkout;
    } catch (error) {
      return {
        data: null,
        success: false,
        message: "something went wrong",
      };
    }
  },
});
