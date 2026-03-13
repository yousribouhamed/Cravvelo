import { NextRequest, NextResponse } from "next/server";
import { checkVideoPlaybackAllowed } from "@/modules/courses/actions/check-video-playback";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as { videoId?: string };
    if (!payload?.videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 });
    }

    const access = await checkVideoPlaybackAllowed({ videoId: payload.videoId });
    if (!access.allowed) {
      return NextResponse.json(
        { allowed: false, reason: access.reason },
        { status: 403 }
      );
    }

    return NextResponse.json({ allowed: true }, { status: 200 });
  } catch (error) {
    console.error("[academia][playback-access] failed to validate playback access", error);
    return NextResponse.json({ error: "Failed to validate playback access" }, { status: 500 });
  }
}
