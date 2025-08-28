export type ChargilyConfigType = {
  publicKey: string;
  secretKey: string;
};

export type ChargilyApiResponse = {
  id: string;
  entity: "checkout";
  livemode: boolean;
  amount: number;
  currency: string;
  fees: number;
  fees_on_merchant: number;
  fees_on_customer: number;
  pass_fees_to_customer: boolean | null;
  chargily_pay_fees_allocation: "customer" | "merchant" | string;
  status: "pending" | "paid" | "failed" | string;
  locale: string;
  description: string | null;
  metadata: Record<string, any> | null;
  success_url: string;
  failure_url: string | null;
  payment_method: string | null;
  invoice_id: string | null;
  customer_id: string;
  payment_link_id: string | null;
  created_at: number;
  updated_at: number;
  shipping_address: string | null;
  collect_shipping_address: number; // 0 or 1
  discount: number | null;
  amount_without_discount: number | null;
  checkout_url: string;
};

export interface ChargilyCheckout {
  id: string;
  entity: "checkout";
  fees: number;
  amount: number;
  locale: string;
  status: "paid" | "failed" | "pending";
  metadata: any | null;
  created_at: number;
  invoice_id: string | null;
  updated_at: number;
  customer_id: string;
  description: string | null;
  failure_url: string | null;
  success_url: string | null;
  payment_method: string | null;
  payment_link_id: string | null;
  pass_fees_to_customer: boolean | null;
  chargily_pay_fees_allocation: "merchant" | "customer";
  shipping_address: any | null;
  collect_shipping_address: 0 | 1;
  discount: any | null;
  amount_without_discount: number | null;
  url: string;
}

export interface ChargilyWebhookEvent {
  id: string;
  entity: "event";
  livemode: "true" | "false";
  type: "checkout.paid" | "checkout.failed";
  data: ChargilyCheckout;
  created_at: number;
  updated_at: number;
}
