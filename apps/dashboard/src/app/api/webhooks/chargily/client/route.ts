import { NextRequest } from "next/server";
import crypto from "crypto";
import useHaveAccess from "@/src/hooks/use-have-access";
import { prisma } from "database/src";

const Get_client_api_secret_key = async () => {
  const user = await useHaveAccess();

  const payment = await prisma.paymentsConnect.findFirst({
    where: {
      accountId: user.accountId,
    },
  });

  return payment;
};
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

  const api_key = await Get_client_api_secret_key();

  // Calculate the signature
  const computedSignature = crypto
    .createHmac("sha256", api_key.chargiySecretKey)
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

  // If the signatures match, proceed to decode the JSON payload

  // Switch based on the event type
  switch (payload) {
    case "checkout.paid":
      console.log(payload);
      break;
    case "checkout.failed":
      console.log("from the webhook");
      console.log("siyad raho makhalassch");
      break;
  }

  await prisma.webhooks.create({
    data: {
      payload: JSON.stringify(payload),
    },
  });

  return new Response(
    JSON.stringify({
      status: "success",
      message:
        "you are not chargilt why do want to do something bad  You will be held accountable on the Day of Resurrection",
    })
  );
}
