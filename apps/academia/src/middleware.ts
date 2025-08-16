import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/modules/auth/lib/jwt";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/pricing",
  "/features",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// Protected route prefixes (routes that require authentication)
const protectedRoutePrefixes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/courses",
  "/admin",
];

// Auth routes (login/register) that authenticated users should be redirected away from
const authRoutes = ["/login", "/register", "/register/confirm"];

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // ========================================
  // 1. TENANT ROUTING LOGIC
  // ========================================

  // Extract subdomain
  const subdomain = hostname.split(".")[0];

  // Skip tenant routing for localhost without subdomain or for specific domains you want to exclude
  if (hostname === "localhost:3000" || hostname.startsWith("www.")) {
    // For main domain (no tenant), only apply auth logic to non-public routes
    const isPublicRoute = isRoutePublic(pathname);
    if (!isPublicRoute && !pathname.startsWith("/api")) {
      return handleAuthentication(request);
    }
    return NextResponse.next();
  }

  // Check if it's a subdomain (tenant)
  const isSubdomain =
    subdomain &&
    subdomain !== "localhost:3000" &&
    subdomain !== "localhost" &&
    hostname.includes(".");

  let response: NextResponse;
  let tenant: string | null = null;

  if (
    isSubdomain ||
    (hostname.includes("localhost:3000") && subdomain !== "localhost:3000")
  ) {
    // Extract tenant from subdomain
    tenant =
      subdomain.replace("localhost:3000", "").replace(/[^a-zA-Z0-9]/g, "") ||
      subdomain;

    // Rewrite to the tenant-specific path
    const url = request.nextUrl.clone();
    url.pathname = `/tenant/${tenant}${url.pathname}`;

    response = NextResponse.rewrite(url);
  } else {
    response = NextResponse.next();
  }

  // ========================================
  // 2. AUTHENTICATION LOGIC
  // ========================================

  // Check if current route is public
  const isPublicRoute = isRoutePublic(pathname);

  // Skip auth logic for public routes
  if (isPublicRoute) {
    return response;
  }

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value;

  // Verify token
  let isAuthenticated = false;
  let payload = null;

  if (token) {
    try {
      payload = await verifyJWT(token);
      isAuthenticated = !!payload;
    } catch (error) {
      // Token is invalid, treat as unauthenticated
      isAuthenticated = false;
      payload = null;
    }
  }

  // Check if route is protected (using prefix matching for nested routes)
  const isProtectedRoute = isRouteProtected(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Add user info and tenant info to headers for server components
  if (payload || tenant) {
    const requestHeaders = new Headers(request.headers);

    if (payload) {
      requestHeaders.set("x-user-id", payload.userId);
      requestHeaders.set("x-user-email", payload.email);
      requestHeaders.set("x-account-id", payload.accountId);
    }

    if (tenant) {
      requestHeaders.set("x-tenant", tenant);
    }

    // For tenant routes, create proper rewrite with headers
    if (tenant) {
      const url = request.nextUrl.clone();
      url.pathname = `/tenant/${tenant}${pathname}`;
      return NextResponse.rewrite(url, {
        request: { headers: requestHeaders },
      });
    } else {
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }
  }

  return response;
}

// Helper function to check if a route is public
function isRoutePublic(pathname: string): boolean {
  // Exact match for public routes
  if (publicRoutes.includes(pathname)) {
    return true;
  }

  // Check for API routes
  if (pathname.startsWith("/api")) {
    return true;
  }

  // Check for static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return true;
  }

  return false;
}

// Helper function to check if a route is protected
function isRouteProtected(pathname: string): boolean {
  return protectedRoutePrefixes.some((prefix) => pathname.startsWith(prefix));
}

// Helper function to handle authentication logic
async function handleAuthentication(
  request: NextRequest
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value;

  // Verify token
  let isAuthenticated = false;
  let payload = null;

  if (token) {
    try {
      payload = await verifyJWT(token);
      isAuthenticated = !!payload;
    } catch (error) {
      // Token is invalid, treat as unauthenticated
      isAuthenticated = false;
      payload = null;
    }
  }

  // Check if route is protected (using prefix matching)
  const isProtectedRoute = isRouteProtected(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Add user info to headers for server components
  if (isAuthenticated && payload) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-email", payload.email);
    requestHeaders.set("x-account-id", payload.accountId);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
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
