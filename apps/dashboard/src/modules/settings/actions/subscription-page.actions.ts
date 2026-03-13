"use server";

import { getCurrentUserSafe } from "@/src/lib/clerk-utils";
import { redirect } from "next/navigation";
import { prisma } from "database/src";
import { getLimitsForPlanCode } from "@/src/constants/plan-limits";
import type { SubscriptionPlanCode } from "@/src/constants/subscription-plans";

export type SubscriptionPageData = {
  subscription: {
    planCode: string;
    billingCycle: string;
    currentPeriodEnd: Date;
  } | null;
  usage: {
    membersCount: number;
    storageUsedBytes: number;
    videoBandwidthUsedBytes: number;
  };
  limits: {
    membersMax: number;
    storageBytes: number;
    videoBandwidthBytes: number;
  };
};

export async function getSubscriptionPageData(): Promise<SubscriptionPageData> {
  const user = await getCurrentUserSafe();
  if (!user) redirect("/sign-in");

  const account = await prisma.account.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      storageUsedBytes: true,
      videoBandwidthUsedBytes: true,
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

  if (!account) redirect("/auth-callback");

  const [membersCount, subscription] = await Promise.all([
    prisma.student.count({ where: { accountId: account.id } }),
    account.AccountSubscription?.[0] ?? null,
  ]);

  const planCode = subscription?.planCode as SubscriptionPlanCode | undefined;
  const limits = getLimitsForPlanCode(planCode ?? null);

  return {
    subscription: subscription
      ? {
          planCode: subscription.planCode,
          billingCycle: subscription.billingCycle,
          currentPeriodEnd: subscription.currentPeriodEnd,
        }
      : null,
    usage: {
      membersCount,
      storageUsedBytes: account.storageUsedBytes,
      videoBandwidthUsedBytes: Number(account.videoBandwidthUsedBytes || 0n),
    },
    limits,
  };
}
