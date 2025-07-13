//@ts-nocheck

import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import useGetUser from "@/src/hooks/use-get-user";
import UserProfileForm from "./ProfileForm";
import { prisma } from "database/src";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return notifications;
};

const getAccountWithDetails = async ({ accountId }: { accountId: string }) => {
  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
    },
    include: {
      // Add any related data you want to include
      // courses: true,
      // subscriptions: true,
      // etc.
    },
  });
  return account;
};

export default async function ProfilePage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const user = await useGetUser();

  const [notifications, account] = await Promise.all([
    getAllNotifications({ accountId: user.accountId }),
    getAccountWithDetails({ accountId: user.accountId }),
  ]);

  if (!account) {
    redirect("/onboarding");
  }

  // Serialize Clerk user data to plain object
  const serializedClerkUser = {
    id: clerkUser?.id || "",
    firstName: clerkUser?.firstName || "",
    lastName: clerkUser?.lastName || "",
    imageUrl: account?.avatarUrl
      ? account?.avatarUrl
      : clerkUser?.imageUrl ?? "",
    hasImage: clerkUser?.hasImage || false,
    primaryEmailAddress: clerkUser?.primaryEmailAddressId
      ? {
          emailAddress: clerkUser.primaryEmailAddressId.emailAddress,
          id: clerkUser.primaryEmailAddressId.id,
        }
      : null,
    primaryPhoneNumber: clerkUser?.primaryPhoneNumberId
      ? {
          phoneNumber: clerkUser.primaryPhoneNumberId.phoneNumber,
          id: clerkUser.primaryPhoneNumberId.id,
        }
      : null,
    username: clerkUser?.username || "",
    createdAt: clerkUser?.createdAt
      ? new Date(clerkUser.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: clerkUser?.updatedAt
      ? new Date(clerkUser.updatedAt).toISOString()
      : new Date().toISOString(),
    lastSignInAt: clerkUser?.lastSignInAt
      ? new Date(clerkUser.lastSignInAt).toISOString()
      : null,
    twoFactorEnabled: clerkUser?.twoFactorEnabled || false,
    banned: clerkUser?.banned || false,
    locked: clerkUser?.locked || false,
  };

  // Enhanced user data combining Clerk and database info
  const enhancedUserData = {
    // Serialized Clerk data
    ...serializedClerkUser,
    // Database data (serialize account object too)
    accountId: account?.id || "",
    user_name: account?.user_name || "",
    user_bio: account?.user_bio || "",
    support_email: account?.support_email || "",
    phone: account?.phone || "",
    website: account?.website || "",
    location: account?.location || "",
    occupation: account?.occupation || "",
    avatarUrl: account?.avatarUrl || "",
    // Computed fields
    fullName:
      `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() ||
      account?.user_name ||
      "مستخدم",
    initials:
      `${clerkUser?.firstName?.[0] || ""}${clerkUser?.lastName?.[0] || ""}` ||
      account?.user_name?.substring(0, 2) ||
      "AB",
  };

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header
          notifications={notifications}
          user={user}
          title="إدارة الملف الشخصي"
        />
        <div className="py-8 flex justify-center">
          <UserProfileForm enhancedUserData={enhancedUserData} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}

// ProfileForm.tsx - Enhanced version
