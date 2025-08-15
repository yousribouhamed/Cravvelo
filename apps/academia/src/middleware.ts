// middleware.ts (place this in your root directory)
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Get the hostname from the request
  const hostname = request.headers.get("host") || "";

  // Extract subdomain
  const subdomain = hostname.split(".")[0];

  // Skip middleware for localhost without subdomain or for specific domains you want to exclude
  if (hostname === "localhost:3000" || hostname.startsWith("www.")) {
    return NextResponse.next();
  }

  // Check if it's a subdomain (not the main domain)
  const isSubdomain =
    subdomain && subdomain !== "localhost:3000" && hostname.includes(".");

  if (
    isSubdomain ||
    (hostname.includes("localhost:3000") && subdomain !== "localhost:3000")
  ) {
    // Extract tenant from subdomain
    const tenant =
      subdomain.replace("localhost:3000", "").replace(/[^a-zA-Z0-9]/g, "") ||
      subdomain;

    // Rewrite to the tenant-specific path
    const url = request.nextUrl.clone();
    url.pathname = `/tenant/${tenant}${url.pathname}`;

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
