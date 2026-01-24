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

export const getUserProfileAction = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const account = await prisma.account.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!account) {
    redirect("/auth-callback");
  }

  // Get primary email and phone
  const primaryEmail = user.emailAddresses?.find(
    (e) => e.id === user.primaryEmailAddressId
  );
  const primaryPhone = user.phoneNumbers?.find(
    (p) => p.id === user.primaryPhoneNumberId
  );

  // Calculate initials
  const firstName = user.firstName || "";
  const lastName = user.lastName || "";
  const initials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
      : firstName
        ? firstName[0].toUpperCase()
        : lastName
          ? lastName[0].toUpperCase()
          : "AB";

  // Build full name
  const fullName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || lastName || account.user_name || "";

  // Helper function to safely convert dates to ISO strings
  const toISOString = (date: Date | number | string | null | undefined): string => {
    if (!date) return new Date().toISOString();
    if (date instanceof Date) return date.toISOString();
    if (typeof date === "number") return new Date(date).toISOString();
    if (typeof date === "string") {
      const parsed = new Date(date);
      return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
    }
    return new Date().toISOString();
  };

  return {
    id: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    imageUrl: user.imageUrl || "",
    hasImage: !!user.imageUrl,
    primaryEmailAddress: primaryEmail
      ? {
          emailAddress: primaryEmail.emailAddress,
          id: primaryEmail.id,
        }
      : null,
    primaryPhoneNumber: primaryPhone
      ? {
          phoneNumber: primaryPhone.phoneNumber,
          id: primaryPhone.id,
        }
      : null,
    username: user.username || "",
    createdAt: toISOString(user.createdAt),
    updatedAt: toISOString(user.updatedAt),
    lastSignInAt: user.lastSignInAt ? toISOString(user.lastSignInAt) : null,
    twoFactorEnabled: user.twoFactorEnabled || false,
    banned: false,
    locked: false,
    accountId: account.id,
    user_name: account.user_name || "",
    user_bio: account.user_bio || "",
    support_email: account.support_email || "",
    phone: account.phone?.toString() || "",
    website: account.website || "",
    location: account.city || account.country || "",
    occupation: account.profession || "",
    avatarUrl: account.avatarUrl || user.imageUrl || "",
    fullName,
    initials,
  };
};
