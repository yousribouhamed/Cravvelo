"use client";

import { PaymentMethodCards } from "./payment-method-selected";

interface CheckoutFormProps {}

export default function CheckoutForm() {
  return (
    <div className="w-full h-screen max-w-7xl ml-auto">
      <PaymentMethodCards />
    </div>
  );
}
