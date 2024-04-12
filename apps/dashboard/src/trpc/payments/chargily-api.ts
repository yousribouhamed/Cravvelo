import { z } from "zod";
import { privateProcedure } from "../trpc";
import { Checkout, Price, Product } from "@/src/types";

// const CHARGILY_BASE_URL = "https://pay.chargily.net/api/v2";
const CHARGILY_BASE_URL =
  process.env.NODE_ENV === "production"
    ? ("https://pay.chargily.net/api/v2" as const)
    : ("https://pay.chargily.net/test/api/v2" as const); // Defining the base URL for Chargily API

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
        isByMounth: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Constructing request options for creating product
        const options = {
          method: "POST",
          headers: {
            // Authorization: `Bearer  ${process.env.CHARGILY_SECRET_KEY}`, // Adding authorization header with secret key
            Authorization: `Bearer ${
              process.env.NODE_ENV === "production"
                ? process.env.CHARGILY_SECRET_KEY
                : "test_sk_0tbIn6qsnP3ALcUh9aNdAqxOb5rcc254olPyRVnK"
            }`, // Adding authorization header with secret key
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
            // Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY}`, // Adding authorization header with secret key
            Authorization: `Bearer ${
              process.env.NODE_ENV === "production"
                ? process.env.CHARGILY_SECRET_KEY
                : "test_sk_0tbIn6qsnP3ALcUh9aNdAqxOb5rcc254olPyRVnK"
            }`, // Adding authorization header with secret key
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: input.isByMounth ? input.amount : input.amount * 12,
            currency: "dzd",
            product_id: product.id,
          }),
        };
        const response2 = await fetch(`${CHARGILY_BASE_URL}/prices`, options2);
        const price = (await response2.json()) as Price;

        const payload = {
          items: [{ price: price.id, quantity: 1 }],
          success_url: input.success_url,
          metadata: [
            {
              accountId: ctx.account.id,
              plan: input.plan_code,
              strategy: input.isByMounth ? "MONTHLY" : "YEARLY",
            },
          ],
          webhook_endpoint: "https://app.cravvelo.com/api/webhooks/chargily",
        };
        const options3 = {
          method: "POST",
          headers: {
            //  Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY}`, // Adding authorization header with secret key
            Authorization: `Bearer ${
              process.env.NODE_ENV === "production"
                ? process.env.CHARGILY_SECRET_KEY
                : "test_sk_0tbIn6qsnP3ALcUh9aNdAqxOb5rcc254olPyRVnK"
            }`, // Adding authorization header with secret key
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload), // Constructing the body with payload
        };
        const response3 = await fetch(
          `${CHARGILY_BASE_URL}/checkouts`,
          options3
        ); // Sending a POST request to create a checkout
        const data = (await response3.json()) as Checkout; // Parsing response JSON into Checkout type
        console.log("this is the chekout url");
        console.log(data);
        return data; // Returning the checkout data
      } catch (err) {
        console.error(err); // Handling errors and logging them
      }
    }),

  /**
   * Procedure to pay with Chargily.
   * Validates input and makes requests to Chargily API to process payment.
   */
  upgrade_with_chargily: privateProcedure
    .input(
      z.object({
        product_name: z.string(), // Schema for product name
        amount: z.number(), // Schema for amount
        success_url: z.string(), // Schema for success URL
        plan_code: z.string(),
        isByMounth: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Constructing request options for creating product
        const options = {
          method: "POST",
          headers: {
            // Authorization: `Bearer  ${process.env.CHARGILY_SECRET_KEY}`, // Adding authorization header with secret key
            Authorization: `Bearer ${
              process.env.NODE_ENV === "production"
                ? process.env.CHARGILY_SECRET_KEY
                : "test_sk_0tbIn6qsnP3ALcUh9aNdAqxOb5rcc254olPyRVnK"
            }`, // Adding authorization header with secret key
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
            // Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY}`, // Adding authorization header with secret key
            Authorization: `Bearer ${
              process.env.NODE_ENV === "production"
                ? process.env.CHARGILY_SECRET_KEY
                : "test_sk_0tbIn6qsnP3ALcUh9aNdAqxOb5rcc254olPyRVnK"
            }`, // Adding authorization header with secret key
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: input.isByMounth ? input.amount : input.amount * 12,
            currency: "dzd",
            product_id: product.id,
          }),
        };
        const response2 = await fetch(`${CHARGILY_BASE_URL}/prices`, options2);
        const price = (await response2.json()) as Price;

        const payload = {
          items: [{ price: price.id, quantity: 1 }],
          success_url: input.success_url,
          metadata: [
            {
              accountId: ctx.account.id,
              plan: input.plan_code,
              strategy: input.isByMounth ? "MONTHLY" : "YEARLY",
            },
          ],
          webhook_endpoint:
            "https://app.cravvelo.com/api/webhooks/chargily/upgrade",
        };
        const options3 = {
          method: "POST",
          headers: {
            //  Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY}`, // Adding authorization header with secret key
            Authorization: `Bearer ${
              process.env.NODE_ENV === "production"
                ? process.env.CHARGILY_SECRET_KEY
                : "test_sk_0tbIn6qsnP3ALcUh9aNdAqxOb5rcc254olPyRVnK"
            }`, // Adding authorization header with secret key
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload), // Constructing the body with payload
        };
        const response3 = await fetch(
          `${CHARGILY_BASE_URL}/checkouts`,
          options3
        ); // Sending a POST request to create a checkout
        const data = (await response3.json()) as Checkout; // Parsing response JSON into Checkout type
        console.log("this is the chekout url");
        console.log(data);
        return data; // Returning the checkout data
      } catch (err) {
        console.error(err); // Handling errors and logging them
      }
    }),
};
