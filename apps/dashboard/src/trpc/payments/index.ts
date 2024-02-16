import { chargily } from "./chargily-api";
import { createStripeSession } from "./create-checkout-session";
import { stripe } from "./stripe-api";
import { user_chargily } from "./user-chargily-api";

export const payment = {
  createStripeSession,
  ...chargily,
  ...stripe,
  ...user_chargily,
};
