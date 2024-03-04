"use server";

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "database/src";

// this sunction should run on the server only
const useHaveAccess = async () => {
  const currentDate = new Date();

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

  const trialEndDate = new Date(account.createdAt);
  trialEndDate.setDate(trialEndDate.getDate() + 14);

  // here we check if the user is paid user or not

  const isFreeTrial = currentDate < trialEndDate;

  const isSubscribed = account.plan ? true : false;

  console.log("this is the free trial ");
  console.log(isFreeTrial);
  console.log("and this is the subscription status");
  console.log(isSubscribed);

  return {
    userId: user.id,
    accountId: account?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    avatar: account?.avatarUrl ? account?.avatarUrl : user?.imageUrl,
    email: user?.primaryEmailAddressId,
    isFreeTrial,
    isSubscribed,
    subdomain: account.Website[0]?.subdomain,
    customDomain: account.Website[0]?.customDomain,
    createdAt: account.createdAt,
  };
};

export default useHaveAccess;
