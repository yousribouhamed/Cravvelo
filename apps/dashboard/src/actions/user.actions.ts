import { getCurrentUserSafe } from "@/src/lib/clerk-utils";
import { redirect } from "next/navigation";
import { prisma } from "database/src";
import { cache } from "react";

/**
 * Get website data for an account
 * Cached to deduplicate requests within a single render cycle
 */
export const getWebsiteByAccountId = cache(
  async (accountId: string) => {
    const website = await prisma.website.findFirst({
      where: {
        accountId,
      },
    });
    return website;
  }
);

/**
 * Get all notifications for an account
 * Cached to deduplicate requests within a single render cycle
 */
export const getAllNotifications = cache(
  async ({ accountId }: { accountId: string }) => {
    const notifications = await prisma.notification.findMany({
      where: {
        accountId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
    });
    return notifications;
  }
);

/**
 * Get the current user with their account and website data
 * Cached to deduplicate requests within a single render cycle
 * This prevents multiple DB queries when the same data is needed in layouts and pages
 */
export const getMyUserAction = cache(async () => {
  const user = await getCurrentUserSafe();

  if (!user) {
    redirect("/sign-in");
  }

  const account = await prisma.account.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      Website: true,
      AccountSubscription: {
        where: { status: "ACTIVE" },
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: {
          planCode: true,
          billingCycle: true,
          currentPeriodEnd: true,
        },
      },
    },
  });

  if (!account) {
    redirect("/auth-callback");
  }

  const subscription = account.AccountSubscription?.[0]
    ? {
        planCode: account.AccountSubscription[0].planCode,
        billingCycle: account.AccountSubscription[0].billingCycle,
        currentPeriodEnd: account.AccountSubscription[0].currentPeriodEnd,
      }
    : null;

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
    subscription,
  };
});

export const getUserProfileAction = async () => {
  const user = await getCurrentUserSafe();

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
