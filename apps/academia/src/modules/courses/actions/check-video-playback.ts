"use server";

import z from "zod";
import { withTenant } from "@/_internals/with-tenant";
import { getLimitsForPlanCode } from "@/constants/plan-limits";

export const checkVideoPlaybackAllowed = withTenant({
  input: z.object({
    videoId: z.string().min(1),
  }),
  handler: async ({ db, accountId, input }) => {
    const videoAssetDelegate = (
      db as unknown as {
        videoAsset?: { findUnique?: (...args: any[]) => Promise<any> };
      }
    ).videoAsset;
    const asset =
      videoAssetDelegate &&
      typeof videoAssetDelegate.findUnique === "function"
        ? await videoAssetDelegate.findUnique({
            where: { videoId: input.videoId },
            select: { accountId: true },
          })
        : null;

    if (asset && asset.accountId !== accountId) {
      return {
        allowed: false,
        reason: "video_not_owned",
      };
    }

    const account = await db.account.findUnique({
      where: { id: accountId },
      select: {
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
      return {
        allowed: false,
        reason: "account_not_found",
      };
    }

    const planCode = account.AccountSubscription?.[0]?.planCode ?? null;
    const limits = getLimitsForPlanCode(planCode);
    const usage = account.videoBandwidthUsedBytes ?? 0n;

    if (usage >= BigInt(limits.videoBandwidthBytes)) {
      return {
        allowed: false,
        reason: "bandwidth_limit_reached",
      };
    }

    return {
      allowed: true,
      reason: "ok",
    };
  },
});
