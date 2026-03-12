import { NextRequest, NextResponse } from "next/server";
import { prisma } from "database/src";

/**
 * GET /api/track-visit?tenant=<tenant>&sessionId=<sessionId>
 * Counts one unique visit per browser session. If sessionId is provided and new for this website,
 * creates a VisitorSession and increments WebsiteAnalytics (visits, uniqueVisitors) for today.
 * Refreshes in the same session do not increment.
 */
export async function GET(request: NextRequest) {
  const tenant = request.nextUrl.searchParams.get("tenant");
  const sessionId = request.nextUrl.searchParams.get("sessionId");

  if (!tenant || typeof tenant !== "string" || !tenant.trim()) {
    return NextResponse.json(
      { error: "Missing or invalid tenant" },
      { status: 400 }
    );
  }
  if (!sessionId || typeof sessionId !== "string" || !sessionId.trim()) {
    return NextResponse.json(
      { error: "Missing or invalid sessionId" },
      { status: 400 }
    );
  }

  const trimmedTenant = tenant.trim();
  const trimmedSessionId = sessionId.trim();

  try {
    const website = await prisma.website.findFirst({
      where: {
        OR: [
          { subdomain: trimmedTenant },
          { customDomain: trimmedTenant },
        ],
        suspended: false,
      },
      select: { id: true },
    });

    if (!website) {
      return NextResponse.json(
        { error: "Website not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    await prisma.$transaction([
      prisma.visitorSession.create({
        data: {
          websiteId: website.id,
          sessionId: trimmedSessionId,
        },
      }),
      prisma.websiteAnalytics.upsert({
        where: {
          websiteId_date: {
            websiteId: website.id,
            date: startOfToday,
          },
        },
        create: {
          websiteId: website.id,
          date: startOfToday,
          visits: 1,
          pageViews: 1,
          uniqueVisitors: 1,
        },
        update: {
          visits: { increment: 1 },
          pageViews: { increment: 1 },
          uniqueVisitors: { increment: 1 },
        },
      }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return new NextResponse(null, { status: 204 });
    }
    console.error("[track-visit] Error:", error);
    return NextResponse.json(
      { error: "Failed to track visit" },
      { status: 500 }
    );
  }
}
