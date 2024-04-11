import { NextRequest } from "next/server";
import { prisma } from "database/src";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const signature = request.nextUrl.searchParams.get("signature");
  const payload = await request.json();

  // If there is no signature, ignore the request
  if (!signature) {
    return new Response(
      JSON.stringify({
        status: "failed",
        message:
          "you are not chargilt why do want to do something bad  You will be held accountable on the Day of Resurrection",
      })
    );
  }

  // Calculate the signature
  const computedSignature = crypto
    .createHmac("sha256", "test_sk_0tbIn6qsnP3ALcUh9aNdAqxOb5rcc254olPyRVnK")
    .update(payload)
    .digest("hex");

  // If the calculated signature doesn't match the received signature, ignore the request
  if (computedSignature !== signature) {
    return new Response(
      JSON.stringify({
        status: "failed",
        message:
          "you are not chargilt why do want to do something bad  You will be held accountable on the Day of Resurrection",
      })
    );
  }

  // Switch based on the event type
  switch (payload.type) {
    case "checkout.paid":
      const accountId = payload.data.metadata[0]?.accountId;

      const plan_code = payload.data.metadata[0]?.plan;

      const currentDate: Date = new Date();

      // update the account status
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

      await prisma.payments.create({
        data: {
          end_of_subscription: new Date(
            currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
          ),
          strategy: "MOUNTHLY",
          accountId: accountId,
          plan:
            plan_code === "ADVANCED"
              ? "ADVANCED"
              : plan_code === "PRO"
              ? "PRO"
              : "BASIC",
          payload: JSON.stringify({ something: "true" }),
        },
      });

      //  update the payment in the database

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
