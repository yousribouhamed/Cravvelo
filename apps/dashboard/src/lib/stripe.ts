import Stripe from "stripe";
import { prisma } from "database/src";

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
