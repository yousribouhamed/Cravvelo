"use server";

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "database/src";
import { daysLeftInTrial } from "../lib/utils";

// this sunction should run on the server only
const useGetUser = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const account = await prisma.account.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      Website: true,
    },
  });

  if (!account) {
    redirect("/auth-callback");
  }

  const payment = await prisma.payments.findFirst({
    where: {
      accountId: account.id,
    },
  });

  const trialStartDate = account.createdAt;
  const trialEndDate = new Date(trialStartDate);
  trialEndDate.setDate(trialEndDate.getDate() + 14); // Adding 14 days to trial start date

  // here we check if the user is paid user or not

  // const isSubscribed = account.plan ? true : false;

  const isSubscribed = account.plan ? true : false;

  const isFreeTrial = !isSubscribed && daysLeftInTrial(account.createdAt) > 0;

  return {
    userId: user.id,
    strategy: payment?.strategy,
    endSubscription: payment?.end_of_subscription,
    currentPlan: account.plan,
    accountId: account?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    user_name: account.user_name,
    avatar: account?.avatarUrl ? account?.avatarUrl : user?.imageUrl,
    email: user?.primaryEmailAddressId,
    isFreeTrial,
    isSubscribed,
    subdomain: account.Website[0]?.subdomain,
    customDomain: account.Website[0]?.customDomain,
    createdAt: account.createdAt,
  };
};

export default useGetUser;
