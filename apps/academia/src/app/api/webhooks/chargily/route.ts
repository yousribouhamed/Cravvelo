import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  ChargilyCheckout,
  ChargilyWebhookEvent,
} from "@/modules/payments/types";

// Your Chargily Pay Secret key
const apiSecretKey =
  process.env.CHARGILY_SECRET_KEY ||
  "test_sk_Fje5EhFwyGTGqk4M6et3Jxxxxxxxxxxxxxxxxxxxx";

export async function POST(request: NextRequest) {
  try {
    // Get the signature from headers
    const signature = request.headers.get("signature");

    // Get the raw body
    const body = await request.text();

    // If there is no signature, ignore the request
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Calculate the signature
    const computedSignature = crypto
      .createHmac("sha256", apiSecretKey)
      .update(body)
      .digest("hex");

    // If the calculated signature doesn't match the received signature, ignore the request
    if (computedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    // Parse the JSON payload
    const event: ChargilyWebhookEvent = JSON.parse(body);

    // Switch based on the event type
    switch (event.type) {
      case "checkout.paid":
        const checkout = event.data;
        console.log("Payment successful:", {
          checkoutId: checkout.id,
          amount: checkout.amount,
          customerId: checkout.customer_id,
          status: checkout.status,
        });

        // Handle the successful payment
        await handleSuccessfulPayment(checkout);
        break;

      case "checkout.failed":
        const failedCheckout = event.data;
        console.log("Payment failed:", {
          checkoutId: failedCheckout.id,
          customerId: failedCheckout.customer_id,
          status: failedCheckout.status,
        });

        // Handle the failed payment
        await handleFailedPayment(failedCheckout);
        break;

      default:
        console.log("Unknown event type:", event.type);
    }

    // Respond with a 200 OK status code
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper functions to handle different payment scenarios
async function handleSuccessfulPayment(checkout: ChargilyCheckout) {
  try {
    // Add your business logic here
    // For example:
    // - Update order status in database
    // - Send confirmation email
    // - Update user account
    // - Trigger fulfillment process

    console.log(`Processing successful payment for checkout: ${checkout.id}`);
    console.log(`Amount: ${checkout.amount} (fees: ${checkout.fees})`);
    console.log(`Customer: ${checkout.customer_id}`);

    // Example database update (pseudo-code)
    // await updateOrderStatus(checkout.id, 'completed');
    // await sendConfirmationEmail(checkout.customer_id, checkout);
  } catch (error) {
    console.error("Error handling successful payment:", error);
    throw error;
  }
}

async function handleFailedPayment(checkout: ChargilyCheckout) {
  try {
    // Add your business logic here
    // For example:
    // - Update order status to failed
    // - Send failure notification
    // - Log for analysis

    console.log(`Processing failed payment for checkout: ${checkout.id}`);
    console.log(`Customer: ${checkout.customer_id}`);

    // Example database update (pseudo-code)
    // await updateOrderStatus(checkout.id, 'failed');
    // await logFailedPayment(checkout);
  } catch (error) {
    console.error("Error handling failed payment:", error);
    throw error;
  }
}

// Optional: Export types for use in other parts of your application
export type { ChargilyWebhookEvent, ChargilyCheckout };
