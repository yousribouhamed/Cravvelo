import type { CartLineItem, StripePaymentStatus } from "@/src/types";

import { cn } from "@ui/lib/utils";

export function calculateOrderAmount(items: CartLineItem[]) {
  const total = items.reduce((acc, item) => {
    return acc + Number(item.price);
  }, 0);
  const fee = total * 0.01;
  return {
    total: Number((total * 100).toFixed(0)),
    fee: Number((fee * 100).toFixed(0)),
  };
}

export const stripePaymentStatuses: {
  label: string;
  value: StripePaymentStatus;
}[] = [
  { label: "Canceled", value: "canceled" },
  { label: "Processing", value: "processing" },
  { label: "Requires Action", value: "requires_action" },
  { label: "Requires Capture", value: "requires_capture" },
  { label: "Requires Confirmation", value: "requires_confirmation" },
  { label: "Requires Payment Method", value: "requires_payment_method" },
  { label: "Succeeded", value: "succeeded" },
];

export function getStripePaymentStatusColor({
  status,
  shade = 600,
}: {
  status: StripePaymentStatus;
  shade?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
}) {
  const bg = `bg-${shade}`;

  return cn({
    [`${bg}-red`]: status === "canceled",
    [`${bg}-yellow`]: [
      "processing",
      "requires_action",
      "requires_capture",
      "requires_confirmation",
      "requires_payment_method",
    ].includes(status),
    [`bg-green-${shade}`]: status === "succeeded",
  });
}
