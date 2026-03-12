import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Event;
    if (!payload?.type) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    switch (payload.type) {
      case "checkout.paid": {
        const metadata = payload.data?.metadata?.[0];
        const accountId = metadata?.accountId;
        const paymentId = metadata?.paymentId;

        if (!accountId || !paymentId) {
          return NextResponse.json(
            { error: "Missing accountId or paymentId in metadata" },
            { status: 400 }
          );
        }

        // Legacy endpoint: acknowledge event to avoid Chargily retries.
        console.log(
          `Chargily webhook received on legacy endpoint for account ${accountId}, payment ${paymentId}`
        );
        break;
      }
      case "checkout.failed":
        break;
      default:
        console.log("⚠️ Unknown event type:", payload.type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Chargily legacy webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
