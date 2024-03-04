import { z } from "zod";
import { privateProcedure, publicProcedure } from "../trpc";
import { Checkout, Price, Product } from "@/src/types";

const CHARGILY_BASE_URL = "https://pay.chargily.net/test/api/v2" as const; // Defining the base URL for Chargily API

/**
 * Chargily service object containing payment-related procedures.
 */
export const chargily = {
  /**
   * Procedure to pay with Chargily.
   * Validates input and makes requests to Chargily API to process payment.
   */
  pay_with_chargily: privateProcedure
    .input(
      z.object({
        product_name: z.string(), // Schema for product name
        amount: z.number(), // Schema for amount
        success_url: z.string(), // Schema for success URL
        plan_code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Constructing request options for creating product
        const options = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY}`, // Adding authorization header with secret key
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: input.product_name }), // Constructing the body with product_name
        };
        const response = await fetch(`${CHARGILY_BASE_URL}/products`, options); // Sending a POST request to create a product
        const product = (await response.json()) as Product; // Parsing response JSON into Product type

        // Constructing request options for creating price
        const options2 = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY}`, // Adding authorization header with secret key
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: input.amount,
            currency: "dzd",
            product_id: product.id,
          }), // Constructing the body with amount, currency, and product_id
        };
        const response2 = await fetch(`${CHARGILY_BASE_URL}/prices`, options2); // Sending a POST request to create a price
        const price = (await response2.json()) as Price; // Parsing response JSON into Price type

        const payload = {
          items: [{ price: price.id, quantity: 1 }], // Constructing the payload for creating a checkout
          success_url: input.success_url, // Adding success URL to payload
          metadata: [
            {
              accountId: ctx.account.id,
              plan: input.plan_code,
            },
          ],
        };

        // Constructing request options for creating checkout
        const options3 = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY}`, // Adding authorization header with secret key
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload), // Constructing the body with payload
        };
        const response3 = await fetch(
          `${CHARGILY_BASE_URL}/checkouts`,
          options3
        ); // Sending a POST request to create a checkout
        const data = (await response3.json()) as Checkout; // Parsing response JSON into Checkout type
        return data; // Returning the checkout data
      } catch (err) {
        console.error(err); // Handling errors and logging them
      }
    }),
};
