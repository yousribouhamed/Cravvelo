"use server";

/**
 * Module for interfacing with the Chargily server to create products, prices, and checkouts.
 * Contains functions for creating products, prices, and checkouts.
 * @requires getChargilyKeys Function to obtain Chargily secret keys.
 */

import { Checkout, Price, Product } from "@/src/types";
import { getChargilyKeys } from ".";

// const CHARGILY_BASE_URL = "https://pay.chargily.net/api/v2";
const CHARGILY_BASE_URL =
  process.env.NODE_ENV === "production"
    ? ("https://pay.chargily.net/api/v2" as const)
    : ("https://pay.chargily.net/test/api/v2" as const); // Defining the base URL for Chargily API
// process.env.NODE_ENV === "production"
//   ? ( as const)
//   : ("https://pay.chargily.net/test/api/v2" as const); // Defining the base URL for Chargily API
/**
 * Function to create a product on the Chargily server.
 * @param product_name The name of the product to be created.
 * @param subdomain The subdomain associated with the Chargily account.
 * @returns A Promise that resolves to the created Product or undefined.
 */
export const create_product = async ({
  product_name,
  subdomain,
}: {
  product_name: string;
  subdomain: string;
}): Promise<Product | undefined> => {
  const secret_key = await getChargilyKeys({ subdomain }); // Obtaining Chargily secret keys
  console.log("this is the secret key");
  console.log(secret_key);
  const options = {
    method: "POST",
    headers: {
      //  Authorization: `Bearer ${secret_key.chargiySecretKey}`, // Adding authorization header with secret key
      Authorization: `Bearer ${
        process.env.NODE_ENV === "production"
          ? secret_key.chargiySecretKey
          : "test_sk_0tbIn6qsnP3ALcUh9aNdAqxOb5rcc254olPyRVnK"
      }`, // Adding authorization header with secret key
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: product_name }), // Body containing the product name
  };

  try {
    const response = await fetch(`${CHARGILY_BASE_URL}/products`, options); // Sending a POST request to create a product
    const data = (await response.json()) as Product; // Parsing response JSON into Product type

    return data; // Returning the created product
  } catch (err) {
    console.error(err); // Logging errors if any occur during the process
  }
};

/**
 * Function to create a price for a product on the Chargily server.
 * @param amount The amount of the price to be created.
 * @param product_id The ID of the product associated with the price.
 * @param subdomain The subdomain associated with the Chargily account.
 * @returns A Promise that resolves to the created Price or undefined.
 */
export const create_price = async ({
  amount,
  product_id,
  subdomain,
}: {
  amount: number;
  product_id: string;
  subdomain: string;
}): Promise<Price | undefined> => {
  const secret_key = await getChargilyKeys({ subdomain }); // Obtaining Chargily secret keys
  const options = {
    method: "POST",
    headers: {
      // Authorization: `Bearer ${secret_key.chargiySecretKey}`, // Adding authorization header with secret key
      Authorization: `Bearer ${
        process.env.NODE_ENV === "production"
          ? secret_key.chargiySecretKey
          : "test_sk_0tbIn6qsnP3ALcUh9aNdAqxOb5rcc254olPyRVnK"
      }`, // Adding authorization header with secret key
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount, currency: "dzd", product_id }), // Body containing amount, currency, and product ID
  };

  try {
    const response = await fetch(`${CHARGILY_BASE_URL}/prices`, options); // Sending a POST request to create a price
    const data = (await response.json()) as Price; // Parsing response JSON into Price type

    return data; // Returning the created price
  } catch (err) {
    console.error(err); // Logging errors if any occur during the process
  }
};

/**
 * Function to create a checkout on the Chargily server.
 * @param price_id The ID of the price associated with the checkout.
 * @param success_url The URL to redirect to after successful checkout.
 * @param subdomain The subdomain associated with the Chargily account.
 * @param metadata Additional metadata associated with the checkout.
 * @returns A Promise that resolves to the created Checkout or undefined.
 */
export const create_checkout = async ({
  price_id,
  success_url,
  subdomain,
  metadata,
  webhook_endpoint,
}: {
  price_id: string;
  success_url: string;
  subdomain: string;
  webhook_endpoint: string;
  metadata: {
    studentId: string;
    productId: string;
  };
}): Promise<Checkout | undefined> => {
  const secret_key = await getChargilyKeys({ subdomain }); // Obtaining Chargily secret keys
  const payload = {
    items: [{ price: price_id, quantity: 1 }],
    success_url,
    metadata: [metadata],
    webhook_endpoint,
  }; // Payload for creating a checkout

  const options = {
    method: "POST",
    headers: {
      //  Authorization: `Bearer ${secret_key.chargiySecretKey}`, // Adding authorization header with secret key
      Authorization: `Bearer ${
        process.env.NODE_ENV === "production"
          ? secret_key.chargiySecretKey
          : "test_sk_0tbIn6qsnP3ALcUh9aNdAqxOb5rcc254olPyRVnK"
      }`, // Adding authorization header with secret key
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload), // Body containing the payload
  };

  try {
    const response = await fetch(`${CHARGILY_BASE_URL}/checkouts`, options); // Sending a POST request to create a checkout
    const data = (await response.json()) as Checkout; // Parsing response JSON into Checkout type

    return data; // Returning the created checkout
  } catch (err) {
    console.error(err); // Logging errors if any occur during the process
  }
};

export const payWithChargily = async ({
  amount,
  metadata,
  product_name,
  subdomain,
  success_url,
  webhook_url ,
}: {
  product_name: string;
  subdomain: string;
  amount: number;
  webhook_url : string ;
  success_url: string;
  metadata: {
    studentId: string;
    productId: string;
  };
}) => {
  try {
    const secret_key = await getChargilyKeys({ subdomain }); // Obtaining Chargily secret keys

    const options = {
      method: "POST",
      headers: {
        // Authorization: `Bearer ${secret_key.chargiySecretKey}`, // Adding authorization header with secret key
        Authorization: `Bearer ${
          process.env.NODE_ENV === "production"
            ? secret_key.chargiySecretKey
            : "test_sk_0tbIn6qsnP3ALcUh9aNdAqxOb5rcc254olPyRVnK"
        }`, // Adding authorization header with secret key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: product_name }), // Body containing the product name
    };
    const response = await fetch(`${CHARGILY_BASE_URL}/products`, options); // Sending a POST request to create a product
    const product = (await response.json()) as Product; // Parsing response JSON into Product type
    if (!product) {
      throw new Error("faild to create a product");
    }

    const options2 = {
      method: "POST",
      headers: {
        //   Authorization: `Bearer ${secret_key.chargiySecretKey}`, // Adding authorization header with secret key
        Authorization: `Bearer ${
          process.env.NODE_ENV === "production"
            ? secret_key.chargiySecretKey
            : "test_sk_0tbIn6qsnP3ALcUh9aNdAqxOb5rcc254olPyRVnK"
        }`, // Adding authorization header with secret key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, currency: "dzd", product_id: product.id }), // Body containing amount, currency, and product ID
    };

    const response2 = await fetch(`${CHARGILY_BASE_URL}/prices`, options2); // Sending a POST request to create a price
    const price = (await response2.json()) as Price; // Parsing response JSON into Price type
    if (!price) {
      throw new Error("faild to create a price");
    }
    console.log(price);

    const payload = {
      items: [{ price: price.id, quantity: 1 }],
      success_url,
      metadata: [metadata],
      webhook_endpoint: webhook_url,
    }; // Payload for creating a checkout

    const options3 = {
      method: "POST",
      headers: {
        //  Authorization: `Bearer ${secret_key.chargiySecretKey}`, // Adding authorization header with secret key
        Authorization: `Bearer ${
          process.env.NODE_ENV === "production"
            ? secret_key.chargiySecretKey
            : "test_sk_0tbIn6qsnP3ALcUh9aNdAqxOb5rcc254olPyRVnK"
        }`, // Adding authorization header with secret key
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Body containing the payload
    };
    const response3 = await fetch(`${CHARGILY_BASE_URL}/checkouts`, options3); // Sending a POST request to create a checkout
    const checkout = (await response3.json()) as Checkout; // Parsing response JSON into Checkout type
    if (!checkout) {
      throw new Error("faild to create a checkout");
    }

    return checkout?.checkout_url;
  } catch (err) {
    console.error("there is a problem paying with vhargily");
    console.error(err);
  }
};
