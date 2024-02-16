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
  const payload = await request.json();
  await prisma.webhooks.create({
    data: {
      payload: JSON.stringify(payload),
    },
  });

  // get the user id from the meta data
  // update his bag
}
