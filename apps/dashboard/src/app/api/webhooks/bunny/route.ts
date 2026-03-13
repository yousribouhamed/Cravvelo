import { NextRequest, NextResponse } from "next/server";
import { prisma } from "database/src";

type BunnyWebhookPayload = {
  id?: string;
  eventId?: string;
  guid?: string;
  videoId?: string;
  videoGuid?: string;
  eventType?: string;
  bytesUsed?: number;
  bandwidthBytes?: number;
  transferredBytes?: number;
  data?: {
    id?: string;
    guid?: string;
    videoId?: string;
    videoGuid?: string;
    eventType?: string;
    bytesUsed?: number;
    bandwidthBytes?: number;
    transferredBytes?: number;
  };
};

function extractVideoId(payload: BunnyWebhookPayload): string | null {
  return (
    payload.videoId ||
    payload.videoGuid ||
    payload.guid ||
    payload.data?.videoId ||
    payload.data?.videoGuid ||
    payload.data?.guid ||
    null
  );
}

function extractBytes(payload: BunnyWebhookPayload): bigint {
  const value =
    payload.bytesUsed ??
    payload.bandwidthBytes ??
    payload.transferredBytes ??
    payload.data?.bytesUsed ??
    payload.data?.bandwidthBytes ??
    payload.data?.transferredBytes ??
    0;
  const normalized = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  return BigInt(normalized);
}

function extractRequestId(payload: BunnyWebhookPayload, req: NextRequest): string | null {
  return (
    payload.eventId ||
    payload.id ||
    req.headers.get("x-request-id") ||
    req.headers.get("x-bunny-event-id") ||
    null
  );
}

function isAuthorized(request: NextRequest): boolean {
  const configuredSecret = process.env["BUNNY_WEBHOOK_SECRET"];
  if (!configuredSecret) {
    return true;
  }

  const headerSecret = request.headers.get("x-webhook-secret");
  const authHeader = request.headers.get("authorization");
  const bearerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

  return headerSecret === configuredSecret || bearerToken === configuredSecret;
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized webhook" }, { status: 401 });
    }

    const payload = (await request.json()) as BunnyWebhookPayload;
    const videoId = extractVideoId(payload);
    const bytesUsed = extractBytes(payload);
    const requestId = extractRequestId(payload, request);
    const eventType = payload.eventType || payload.data?.eventType || "bandwidth.usage";

    if (!videoId || bytesUsed <= 0n) {
      return NextResponse.json({ ignored: true }, { status: 202 });
    }

    const videoAssetDelegate = (prisma as { videoAsset?: unknown }).videoAsset;
    const bandwidthDelegate = (prisma as { videoBandwidthEvent?: unknown })
      .videoBandwidthEvent;
    if (
      !videoAssetDelegate ||
      typeof (videoAssetDelegate as { findUnique?: unknown }).findUnique !==
        "function" ||
      !bandwidthDelegate
    ) {
      return NextResponse.json({ ignored: true }, { status: 202 });
    }

    const asset = await (
      videoAssetDelegate as { findUnique: (...args: any[]) => Promise<any> }
    ).findUnique({
      where: { videoId },
      select: { accountId: true },
    });

    if (!asset?.accountId) {
      return NextResponse.json({ ignored: true }, { status: 202 });
    }

    await prisma.$transaction(async (tx) => {
      const txBandwidthDelegate = (
        tx as unknown as { videoBandwidthEvent?: { findUnique?: (...args: any[]) => Promise<any>; create?: (...args: any[]) => Promise<any> } }
      ).videoBandwidthEvent;
      if (
        !txBandwidthDelegate ||
        typeof txBandwidthDelegate.create !== "function"
      ) {
        return;
      }

      if (requestId) {
        if (typeof txBandwidthDelegate.findUnique === "function") {
          const existing = await txBandwidthDelegate.findUnique({
            where: { requestId },
            select: { id: true },
          });
          if (existing) {
            return;
          }
        }
      }

      await txBandwidthDelegate.create({
        data: {
          accountId: asset.accountId,
          videoId,
          bytesUsed,
          eventType,
          requestId,
        },
      });

      await tx.account.update({
        where: { id: asset.accountId },
        data: {
          videoBandwidthUsedBytes: { increment: bytesUsed },
        },
      });
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[bunny-webhook] failed to process payload", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
