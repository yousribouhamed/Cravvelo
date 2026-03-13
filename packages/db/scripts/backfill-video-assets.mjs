#!/usr/bin/env node
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseModules(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== "string") return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function asNonNegativeInt(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.max(0, Math.floor(parsed));
}

const dryRun = process.argv.includes("--dry-run");

async function main() {
  const chapters = await prisma.chapter.findMany({
    select: {
      id: true,
      courseId: true,
      modules: true,
      Course: {
        select: {
          accountId: true,
        },
      },
    },
  });

  const accountVideoStorage = new Map();
  let upsertedAssets = 0;
  let skippedModules = 0;

  for (const chapter of chapters) {
    const modules = parseModules(chapter.modules);
    for (const module of modules) {
      const isVideoModule =
        module &&
        typeof module === "object" &&
        (module.type === "VIDEO" || module.fileType === "VIDEO");
      if (!isVideoModule) continue;

      const videoId = typeof module.fileUrl === "string" ? module.fileUrl : "";
      if (!videoId) {
        skippedModules += 1;
        continue;
      }

      const sizeBytes = asNonNegativeInt(module.size);
      const currentSum = accountVideoStorage.get(chapter.Course.accountId) ?? 0;
      accountVideoStorage.set(chapter.Course.accountId, currentSum + sizeBytes);

      if (dryRun) {
        upsertedAssets += 1;
        continue;
      }

      await prisma.videoAsset.upsert({
        where: { videoId },
        create: {
          accountId: chapter.Course.accountId,
          courseId: chapter.courseId,
          chapterId: chapter.id,
          moduleId: typeof module.id === "string" ? module.id : null,
          videoId,
          sizeBytes,
          source: "COURSE_MODULE",
          status: "ACTIVE",
        },
        update: {
          accountId: chapter.Course.accountId,
          courseId: chapter.courseId,
          chapterId: chapter.id,
          moduleId: typeof module.id === "string" ? module.id : null,
          sizeBytes,
          status: "ACTIVE",
        },
      });
      upsertedAssets += 1;
    }
  }

  if (!dryRun) {
    for (const [accountId, videoStorageBaseline] of accountVideoStorage.entries()) {
      const account = await prisma.account.findUnique({
        where: { id: accountId },
        select: { storageUsedBytes: true },
      });

      if (!account) continue;

      if (account.storageUsedBytes < videoStorageBaseline) {
        await prisma.account.update({
          where: { id: accountId },
          data: { storageUsedBytes: videoStorageBaseline },
        });
      }
    }

    const bandwidthByAccount = await prisma.videoBandwidthEvent.groupBy({
      by: ["accountId"],
      _sum: {
        bytesUsed: true,
      },
    });

    for (const row of bandwidthByAccount) {
      await prisma.account.update({
        where: { id: row.accountId },
        data: {
          videoBandwidthUsedBytes: row._sum.bytesUsed ?? 0n,
        },
      });
    }
  }

  console.log(
    JSON.stringify(
      {
        dryRun,
        processedChapters: chapters.length,
        upsertedAssets,
        skippedModules,
        accountsTouched: accountVideoStorage.size,
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error("Failed to backfill video assets", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
