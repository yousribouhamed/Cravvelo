-- AlterTable
ALTER TABLE "Account"
ADD COLUMN IF NOT EXISTS "videoBandwidthUsedBytes" BIGINT NOT NULL DEFAULT 0;

-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'VideoAssetSource') THEN
    CREATE TYPE "VideoAssetSource" AS ENUM ('COURSE_MODULE', 'COURSE_PREVIEW');
  END IF;
END$$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "VideoAsset" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "source" "VideoAssetSource" NOT NULL DEFAULT 'COURSE_MODULE',
    "courseId" TEXT,
    "chapterId" TEXT,
    "moduleId" TEXT,
    "sizeBytes" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VideoAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "VideoBandwidthEvent" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "bytesUsed" BIGINT NOT NULL DEFAULT 0,
    "eventType" TEXT NOT NULL,
    "requestId" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VideoBandwidthEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "VideoAsset_videoId_key" ON "VideoAsset"("videoId");
CREATE INDEX IF NOT EXISTS "VideoAsset_accountId_idx" ON "VideoAsset"("accountId");
CREATE INDEX IF NOT EXISTS "VideoAsset_videoId_idx" ON "VideoAsset"("videoId");
CREATE INDEX IF NOT EXISTS "VideoAsset_courseId_idx" ON "VideoAsset"("courseId");
CREATE INDEX IF NOT EXISTS "VideoAsset_chapterId_idx" ON "VideoAsset"("chapterId");
CREATE INDEX IF NOT EXISTS "VideoAsset_moduleId_idx" ON "VideoAsset"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "VideoBandwidthEvent_requestId_key" ON "VideoBandwidthEvent"("requestId");
CREATE INDEX IF NOT EXISTS "VideoBandwidthEvent_accountId_idx" ON "VideoBandwidthEvent"("accountId");
CREATE INDEX IF NOT EXISTS "VideoBandwidthEvent_videoId_idx" ON "VideoBandwidthEvent"("videoId");
CREATE INDEX IF NOT EXISTS "VideoBandwidthEvent_occurredAt_idx" ON "VideoBandwidthEvent"("occurredAt");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'VideoAsset_accountId_fkey'
  ) THEN
    ALTER TABLE "VideoAsset"
    ADD CONSTRAINT "VideoAsset_accountId_fkey"
    FOREIGN KEY ("accountId") REFERENCES "Account"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'VideoBandwidthEvent_accountId_fkey'
  ) THEN
    ALTER TABLE "VideoBandwidthEvent"
    ADD CONSTRAINT "VideoBandwidthEvent_accountId_fkey"
    FOREIGN KEY ("accountId") REFERENCES "Account"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;
