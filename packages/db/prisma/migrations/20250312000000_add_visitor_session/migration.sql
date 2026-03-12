-- CreateTable
CREATE TABLE "VisitorSession" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitorSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitorSession_websiteId_sessionId_key" ON "VisitorSession"("websiteId", "sessionId");

-- CreateIndex
CREATE INDEX "VisitorSession_websiteId_idx" ON "VisitorSession"("websiteId");

-- AddForeignKey
ALTER TABLE "VisitorSession" ADD CONSTRAINT "VisitorSession_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
