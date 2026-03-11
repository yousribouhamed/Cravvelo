import { NextRequest, NextResponse } from "next/server";
import { prisma } from "database/src";

function normalizeHost(host: string): string {
  return host.trim().toLowerCase().split(":")[0];
}

export async function GET(request: NextRequest) {
  const hostParam = request.nextUrl.searchParams.get("host");

  if (!hostParam) {
    return NextResponse.json({ canonicalHost: null }, { status: 400 });
  }

  const host = normalizeHost(hostParam);

  try {
    const website = await prisma.website.findFirst({
      where: {
        subdomain: host,
        suspended: false,
      },
      select: {
        customDomain: true,
      },
    });

    return NextResponse.json({
      canonicalHost: website?.customDomain ?? null,
    });
  } catch (error) {
    console.error("[tenant-canonical] lookup failed:", error);
    return NextResponse.json({ canonicalHost: null }, { status: 500 });
  }
}
