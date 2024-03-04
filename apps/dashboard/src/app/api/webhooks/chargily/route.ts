import { NextRequest } from "next/server";
import { prisma } from "database/src";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as Event;

  // Switch based on the event type
  switch (payload.type) {
    case "checkout.paid":
      const accountId = payload.data.metadata[0]?.accountId;

      const plan_code = payload.data.metadata[0]?.plan;

      await prisma.account.update({
        where: {
          id: accountId,
        },
        data: {
          plan:
            plan_code === "ADVANCED"
              ? "ADVANCED"
              : plan_code === "PRO"
              ? "PRO"
              : "BASIC",
        },
      });

      // update the account status

      break;
    case "checkout.failed":
      break;
  }
}

type Metadata = {
  [key: string]: string;
};

type CheckoutData = {
  id: string;
  fees: number;
  amount: number;
  entity: string;
  locale: string;
  status: string;
  currency: string;
  livemode: boolean;
  metadata: Metadata[];
  created_at: number;
  invoice_id: null;
  updated_at: number;
  customer_id: string;
  description: null;
  failure_url: null;
  success_url: string;
  checkout_url: string;
  payment_method: null;
  payment_link_id: null;
  webhook_endpoint: null;
  pass_fees_to_customer: number;
};

type Event = {
  id: string;
  entity: string;
  type: string;
  data: CheckoutData;
  created_at: number;
  updated_at: number;
  livemode: boolean;
};
