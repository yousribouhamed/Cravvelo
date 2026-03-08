import { NextRequest, NextResponse } from "next/server";
import { prisma } from "database/src";

/**
 * GET /api/track-visit?tenant=<tenant>
 * Increments visits and pageViews for the website in WebsiteAnalytics for today (UTC).
 * Tenant can be subdomain (e.g. "twice.cravvelo.com") or custom domain.
 */
export async function GET(request: NextRequest) {
  const tenant = request.nextUrl.searchParams.get("tenant");

  if (!tenant || typeof tenant !== "string" || !tenant.trim()) {
    return NextResponse.json(
      { error: "Missing or invalid tenant" },
      { status: 400 }
    );
  }

  const trimmedTenant = tenant.trim();

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

    await prisma.websiteAnalytics.upsert({
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
      },
      update: {
        visits: { increment: 1 },
        pageViews: { increment: 1 },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[track-visit] Error:", error);
    return NextResponse.json(
      { error: "Failed to track visit" },
      { status: 500 }
    );
  }
}
