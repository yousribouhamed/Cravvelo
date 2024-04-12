import { NextRequest } from "next/server";
import { prisma } from "database/src";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as Event;

  switch (payload.type) {
    case "checkout.paid":
      // how i will do the upgrade option
      // get the chosen plan
      // update the plan in the account by the account id
      // select wether the payment can be yearly or monthly
      // hada makan
      break;

    case "checkout.paid":
      break;
  }
}
