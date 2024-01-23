import { privateProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "database/src";
import { currentUser } from "@clerk/nextjs";
import { getUserSubscriptionPlan, stripe } from "@/src/lib/stripe";
import { PLANS } from "@/src/constants/stripe";
import { absoluteUrl } from "@/src/lib/utils";

export const createStripeSession = privateProcedure.mutation(
  async ({ ctx }) => {
    const user = await currentUser();

    const billingUrl = absoluteUrl("/dashboard/billing");

    console.log("here it is the user");

    if (!user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await prisma.account.findFirst({
      where: {
        userId: user?.id,
      },
    });
    console.log("here it is the db user");
    console.log(dbUser);

    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const subscriptionPlan = await getUserSubscriptionPlan();

    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      });

      return { url: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: PLANS.find((plan) => plan.name === "Pro")?.price.priceIds.test,
          quantity: 1,
        },
      ],
      custom_text: {
        shipping_address: {
          message:
            "Please note that we can't guarantee 2-day delivery for PO boxes at this time.",
        },
        submit: {
          message: "We'll email you instructions on how to get started.",
        },
      },
      metadata: {
        userId: user?.id,
      },
    });

    return { url: stripeSession.url };
  }
);
