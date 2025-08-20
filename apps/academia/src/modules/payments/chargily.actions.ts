"use server";

import { withTenant } from "@/_internals/with-tenant";
import type { ChargilyApiResponse } from "./types";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://pay.chargily.net/test/api/v2/checkouts"
    : "https://pay.chargily.net/api/v2/checkouts";

export const createChargilyCheckout = withTenant({
  handler: async ({ tenant }) => {
    try {
      console.log("this is the chargily");
      console.log(process.env.CHARGILY_SECRET_KEY);
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY!}`,
          "Content-Type": "application/json",
        },
        // the body has litaly to be a string
        body: `{"amount":2000,"currency":"dzd","success_url":"https://${tenant}.cravvelo.com/payments/success"}`,
      });

      if (!response.ok) {
        throw new Error(
          `Chargily API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        message: "the data from message ",
        data: data as ChargilyApiResponse,
      };
    } catch (error) {
      console.error("Failed to create Chargily checkout:", error);
      return {
        success: false,
        message: "the data from message ",
        data: null,
      };
    }
  },
});
