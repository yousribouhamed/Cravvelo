import { privateProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "database/src";
import { currentUser } from "@clerk/nextjs";
import { getUserSubscriptionPlan, stripe } from "@/src/lib/stripe";
import { PLANS } from "@/src/constants/plans";
import { absoluteUrl } from "@/src/lib/utils";
import { z } from "zod";

export const createStripeSession = privateProcedure
  .input(
    z.object({
      plan: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const user = await currentUser();

    const billingUrl = absoluteUrl("/pricing");

    if (!user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

    const account = await prisma.account.findFirst({
      where: {
        userId: user?.id,
      },
    });

    if (!account) throw new TRPCError({ code: "UNAUTHORIZED" });

    const subscriptionPlan = await getUserSubscriptionPlan();

    if (subscriptionPlan.isSubscribed && account.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: account.stripeCustomerId,
        return_url: "https://jadir.vercel.app",
      });

      return { url: stripeSession.url };
    }

    // find the plan the user wan't to subscripe to

    const plan = PLANS.filter((item) => item.plan_code === input.plan);

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: "https://jadir.vercel.app/pricing",
      cancel_url: "https://jadir.vercel.app/pricing",
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: plan[0].priceIds.test,
          quantity: 1,
        },
      ],

      metadata: {
        userId: user?.id,
      },
    });

    return { url: stripeSession.url };
  });
