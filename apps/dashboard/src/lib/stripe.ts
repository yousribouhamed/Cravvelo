import Stripe from "stripe";
import { prisma } from "database/src";
import { PLANS } from "../constants/plans";
import { currentUser } from "@clerk/nextjs";

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY ?? "",
  {
    apiVersion: "2023-10-16",

    appInfo: {
      name: "jadara the best way to create your academy",
      version: "0.1.0",
    },
  }
);

// const createOrRetrieveCustomer = async ({
//   email ,
//   userId
// }: {
//   email : string ,
//   userId : string
// }) => {
//   // verify the accound if it has a stripe id

//   const account = prisma.account.findFirst({where : {userId }})

//   if(!account || account[0]?.)

//  // if not create stripe cutomer id them update the account data and return the id
// }

const upsertPriceRecord = () => {};

const copyBillingDetailsToCustomer = () => {};

const manageSubscriptionStatusChange = () => {};

export async function getUserSubscriptionPlan() {
  const user = await currentUser();

  if (!user.id) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };
  }

  const account = await prisma.account.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!account) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };
  }

  const isSubscribed = Boolean(
    account.stripePriceId &&
      account.stripeCurrentPeriodEnd && // 86400000 = 1 day
      account.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  );

  const plan = isSubscribed
    ? PLANS.find((plan) => plan.priceIds.test === account.stripePriceId)
    : null;

  let isCanceled = false;
  if (isSubscribed && account.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      account.stripeSubscriptionId
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    ...plan,
    stripeSubscriptionId: account.stripeSubscriptionId,
    stripeCurrentPeriodEnd: account.stripeCurrentPeriodEnd,
    stripeCustomerId: account.stripeCustomerId,
    isSubscribed,
    isCanceled,
  };
}
