import type { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getLimitsForPlanCode } from "@/src/constants/plan-limits";
import type { SubscriptionPlanCode } from "@/src/constants/subscription-plans";

export const STORAGE_LIMIT_MESSAGE =
  "Storage limit reached. Please upgrade your plan to upload more files.";
export const BANDWIDTH_LIMIT_MESSAGE =
  "Video bandwidth limit reached. Please upgrade your plan to continue streaming.";

type DbClient = PrismaClient | Prisma.TransactionClient;

export async function getUsageWithPlanLimits(db: DbClient, accountId: string) {
  const account = await db.account.findUnique({
    where: { id: accountId },
    select: {
      id: true,
      storageUsedBytes: true,
      videoBandwidthUsedBytes: true,
      AccountSubscription: {
        where: { status: "ACTIVE" },
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: { planCode: true },
      },
    },
  });

  if (!account) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Account not found" });
  }

  const planCode = account.AccountSubscription?.[0]?.planCode as
    | SubscriptionPlanCode
    | undefined;
  const limits = getLimitsForPlanCode(planCode ?? null);

  return {
    account,
    limits,
  };
}

export async function assertStorageAvailable(
  db: DbClient,
  accountId: string,
  incomingSize: number
) {
  const { account, limits } = await getUsageWithPlanLimits(db, accountId);
  if (account.storageUsedBytes + incomingSize > limits.storageBytes) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: STORAGE_LIMIT_MESSAGE,
    });
  }
}

export async function assertBandwidthAvailable(db: DbClient, accountId: string) {
  const { account, limits } = await getUsageWithPlanLimits(db, accountId);
  const currentUsage = account.videoBandwidthUsedBytes ?? 0n;
  const hardLimit = BigInt(limits.videoBandwidthBytes);
  if (currentUsage >= hardLimit) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: BANDWIDTH_LIMIT_MESSAGE,
    });
  }
}

export async function incrementVideoBandwidthUsage(
  db: DbClient,
  accountId: string,
  bytesUsed: bigint
) {
  if (bytesUsed <= 0n) {
    return;
  }
  await db.account.update({
    where: { id: accountId },
    data: {
      videoBandwidthUsedBytes: { increment: bytesUsed },
    },
  });
}

export async function incrementStorageUsage(
  db: DbClient,
  accountId: string,
  bytes: number
) {
  if (bytes <= 0) return;
  await db.account.update({
    where: { id: accountId },
    data: {
      storageUsedBytes: { increment: bytes },
    },
  });
}

export async function decrementStorageUsage(
  db: DbClient,
  accountId: string,
  bytes: number
) {
  if (bytes <= 0) return;
  const account = await db.account.findUnique({
    where: { id: accountId },
    select: { storageUsedBytes: true },
  });
  if (!account) return;
  const nextValue = Math.max(0, account.storageUsedBytes - bytes);
  await db.account.update({
    where: { id: accountId },
    data: { storageUsedBytes: nextValue },
  });
}

export type UpsertVideoAssetInput = {
  accountId: string;
  courseId?: string;
  chapterId?: string;
  moduleId?: string;
  videoId: string;
  sizeBytes: number;
  source?: Prisma.VideoAssetSource;
  status?: string;
};

export async function upsertVideoAsset(
  db: DbClient,
  input: UpsertVideoAssetInput
) {
  const delegate = (db as { videoAsset?: unknown }).videoAsset;
  if (
    !delegate ||
    typeof (delegate as { upsert?: unknown }).upsert !== "function"
  ) {
    // Prisma client may be stale before generate/migration; keep flow alive.
    return null;
  }

  return (delegate as { upsert: (...args: any[]) => Promise<any> }).upsert({
    where: { videoId: input.videoId },
    create: {
      accountId: input.accountId,
      courseId: input.courseId,
      chapterId: input.chapterId,
      moduleId: input.moduleId,
      videoId: input.videoId,
      sizeBytes: Math.max(0, input.sizeBytes),
      source: input.source ?? "COURSE_MODULE",
      status: input.status ?? "ACTIVE",
    },
    update: {
      accountId: input.accountId,
      courseId: input.courseId,
      chapterId: input.chapterId,
      moduleId: input.moduleId,
      sizeBytes: Math.max(0, input.sizeBytes),
      source: input.source ?? "COURSE_MODULE",
      status: input.status ?? "ACTIVE",
    },
  });
}
