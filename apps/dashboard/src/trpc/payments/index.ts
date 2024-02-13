import { chargily } from "./chargily-api";
import { createStripeSession } from "./create-checkout-session";
import { stripe } from "./stripe-api";

export const payment = {
  createStripeSession,
  ...chargily,
  ...stripe,
};
