"use server";

import { Checkout, Price, Product } from "@/src/types";
import { getChargilyKeys } from ".";

const CHARGILY_BASE_URL = "https://pay.chargily.net/test/api/v2" as const;

export const create_product = async ({
  product_name,
  subdomain,
}: {
  product_name: string;
  subdomain: string;
}): Promise<Product | undefined> => {
  // Function to create a product
  // It takes product_name as input and returns a Promise that resolves to Product or undefined

  const secret_key = await getChargilyKeys({ subdomain });
  // Constructing request options
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret_key.chargiySecretKey}`, // Adding authorization header with secret key
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: product_name }), // Constructing the body with product_name
  };

  try {
    const response = await fetch(`${CHARGILY_BASE_URL}/products`, options); // Sending a POST request to create a product
    const data = (await response.json()) as Product; // Parsing response JSON into Product type

    return data; // Returning the created product
  } catch (err) {
    console.error(err); // Logging errors if any occur during the process
  }
};

export const create_price = async ({
  amount,
  product_id,
  subdomain,
}: {
  amount: number;
  product_id: string;
  subdomain: string;
}): Promise<Price | undefined> => {
  // Function to create a price
  // It takes amount and product_id as input and returns a Promise that resolves to Price or undefined
  const secret_key = await getChargilyKeys({ subdomain });
  // Constructing request options
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret_key.chargiySecretKey}`, // Adding authorization header with secret key
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount, currency: "dzd", product_id }), // Constructing the body with amount, currency, and product_id
  };

  try {
    const response = await fetch(`${CHARGILY_BASE_URL}/prices`, options); // Sending a POST request to create a price
    const data = (await response.json()) as Price; // Parsing response JSON into Price type

    return data; // Returning the created price
  } catch (err) {
    console.error(err); // Logging errors if any occur during the process
  }
};

export const create_checkout = async ({
  price_id,
  success_url,
  subdomain,
}: {
  price_id: string;
  success_url: string;
  subdomain: string;
}): Promise<Checkout | undefined> => {
  // Function to create a checkout
  // It takes price_id and success_url as input and returns a Promise that resolves to Checkout or undefined
  const secret_key = await getChargilyKeys({ subdomain });
  // Constructing payload
  const payload = {
    items: [{ price: price_id, quantity: 1 }],
    success_url,
    metadata: [{ abdullah: "metadatais working" }],
  }; // Constructing the payload for creating a checkout

  // Constructing request options
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret_key.chargiySecretKey}`, // Adding authorization header with secret key
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
};
