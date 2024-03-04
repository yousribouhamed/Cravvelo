import { chargily } from "./chargily-api";
import { user_chargily } from "./user-chargily-api";

export const payment = {
  ...chargily,

  ...user_chargily,
};
