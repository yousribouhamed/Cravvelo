import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "database/src";

export const getAllNotifications = async ({
  accountId,
}: {
  accountId: string;
}) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

export const getMyUserAction = async () => {
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

  return {
    userId: user.id,
    accountId: account?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    user_name: account.user_name,
    avatar: account?.avatarUrl ? account?.avatarUrl : user?.imageUrl,
    email: user?.primaryEmailAddressId,

    subdomain: account.Website?.subdomain ?? "",
    customDomain: account.Website?.customDomain ?? "",
    createdAt: account.createdAt,
    verified: account.verified,
    verification_steps: account.verification_steps,
  };
};
