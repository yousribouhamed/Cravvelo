import { z } from "zod";
import { publicProcedure } from "../trpc";
import { Checkout, Price, Product } from "@/src/types";

const CHARGILY_BASE_URL = "https://pay.chargily.net/test/api/v2" as const;

export const chargily = {
  create_product: publicProcedure
    .input(z.object({ product_name: z.string() }))
    .mutation(async ({ input }) => {
      // Function to create a product
      // It takes product_name as input and returns a Promise that resolves to Product or undefined

      // Constructing request options
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY}`, // Adding authorization header with secret key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: input.product_name }), // Constructing the body with product_name
      };

      try {
        const response = await fetch(`${CHARGILY_BASE_URL}/products`, options); // Sending a POST request to create a product
        const data = (await response.json()) as Product; // Parsing response JSON into Product type

        return data; // Returning the created product
      } catch (err) {
        console.error(err); // Logging errors if any occur during the process
      }
    }),
  create_price: publicProcedure
    .input(
      z.object({
        amount: z.number(),
        product_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Function to create a price
      // It takes amount and product_id as input and returns a Promise that resolves to Price or undefined

      // Constructing request options
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY}`, // Adding authorization header with secret key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: input.amount,
          currency: "dzd",
          product_id: input.product_id,
        }), // Constructing the body with amount, currency, and product_id
      };

      try {
        const response = await fetch(`${CHARGILY_BASE_URL}/prices`, options); // Sending a POST request to create a price
        const data = (await response.json()) as Price; // Parsing response JSON into Price type

        return data; // Returning the created price
      } catch (err) {
        console.error(err); // Logging errors if any occur during the process
      }
    }),
  create_checkout: publicProcedure
    .input(
      z.object({
        price_id: z.string(),
        success_url: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Function to create a checkout
      // It takes price_id and success_url as input and returns a Promise that resolves to Checkout or undefined

      // Constructing payload
      const payload = {
        items: [{ price: input.price_id, quantity: 1 }],
        success_url: input.success_url,
      }; // Constructing the payload for creating a checkout

      // Constructing request options
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY}`, // Adding authorization header with secret key
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Constructing the body with payload
      };

      try {
        const response = await fetch(`${CHARGILY_BASE_URL}/checkouts`, options); // Sending a POST request to create a checkout
        const data = (await response.json()) as Checkout; // Parsing response JSON into Checkout type

        return data; // Returning the created checkout
      } catch (err) {
        console.error(err); // Logging errors if any occur during the process
      }
    }),
};
