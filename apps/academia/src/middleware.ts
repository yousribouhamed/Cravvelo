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
  "/payments/success",
  "/payments/failure",
];

// Protected route prefixes (routes that require authentication)
const protectedRoutePrefixes = [
  "/dashboard",
  "/profile",
  "/settings",
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
  const isLocalhost = hostname.startsWith("localhost:");

  let response: NextResponse;
  let tenant: string | null = null;
  let rewrittenUrl: URL | null = null;

  // Handle localhost (development environment)
  if (isLocalhost) {
    // Check if there's an explicit subdomain (e.g., "twice.localhost:3001")
    if (hostname.includes(".") && subdomain !== "localhost") {
      // Extract tenant from subdomain (e.g., "twice" from "twice.localhost:3001")
      tenant = subdomain.replace(/[^a-zA-Z0-9]/g, "");
    } else {
      // No subdomain: use default tenant for development
      tenant = process.env.NODE_ENV === "development" ? "twice" : null;
    }

    if (tenant) {
      // Rewrite to the tenant-specific path (URL stays the same in browser)
      const url = request.nextUrl.clone();
      url.pathname = `/tenant/${tenant}${url.pathname}`;
      rewrittenUrl = url;
      response = NextResponse.rewrite(url);
    } else {
      response = NextResponse.next();
    }
  } else if (hostname.startsWith("www.")) {
    // Skip tenant routing for www subdomain
    const isPublicRoute = isRoutePublic(pathname);
    if (!isPublicRoute && !pathname.startsWith("/api")) {
      return handleAuthentication(request);
    }
    return NextResponse.next();
  } else {
    // Production: extract tenant from subdomain (e.g., "tenant.cravvelo.com")
    const isSubdomain =
      subdomain &&
      subdomain !== "localhost" &&
      hostname.includes(".");

    if (isSubdomain) {
      tenant = subdomain;

      // Rewrite to the tenant-specific path
      const url = request.nextUrl.clone();
      url.pathname = `/tenant/${tenant}${url.pathname}`;
      rewrittenUrl = url;
      response = NextResponse.rewrite(url);
    } else {
      response = NextResponse.next();
    }
  }

  // Prepare base headers for server components (e.g., locale resolution).
  // IMPORTANT: tenant lookups in DB expect a full domain-like key (e.g. "tenant.cravvelo.com").
  const baseRequestHeaders = new Headers(request.headers);
  if (tenant) {
    baseRequestHeaders.set("x-tenant", `${tenant}.cravvelo.com`);
  }

  // ========================================
  // 2. AUTHENTICATION LOGIC
  // ========================================

  // Redirect authenticated users away from auth routes (login/register) even when they are "public"
  const isAuthRoute = authRoutes.includes(pathname);
  if (isAuthRoute) {
    const authToken = request.cookies.get("auth-token")?.value;
    if (authToken) {
      try {
        const authPayload = await verifyJWT(authToken);
        if (authPayload) {
          const redirectParam = request.nextUrl.searchParams.get("redirect");
          const redirectUrl = redirectParam
            ? new URL(redirectParam, request.url)
            : new URL("/", request.url);
          return NextResponse.redirect(redirectUrl);
        }
      } catch {
        // Token invalid, continue and let them access the auth route
      }
    }
  }

  // Check if current route is public
  const isPublicRoute = isRoutePublic(pathname);

  // Skip auth logic for public routes
  if (isPublicRoute) {
    // Preserve tenant header for public tenant pages so server components can resolve DB locale.
    if (rewrittenUrl) {
      return NextResponse.rewrite(rewrittenUrl, {
        request: { headers: baseRequestHeaders },
      });
    }

    // If we didn't rewrite, still forward headers.
    return NextResponse.next({
      request: { headers: baseRequestHeaders },
    });
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

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated) {
    // Check if there's a redirect parameter, otherwise go to home
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    if (redirectParam) {
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }
    // Default to home page instead of dashboard
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Add user info and tenant info to headers for server components
  if (payload || tenant) {
    const requestHeaders = new Headers(baseRequestHeaders);

    if (payload) {
      requestHeaders.set("x-user-id", payload.userId);
      requestHeaders.set("x-user-email", payload.email);
      requestHeaders.set("x-account-id", payload.accountId);
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
    // Check if there's a redirect parameter, otherwise go to home
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    if (redirectParam) {
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }
    // Default to home page instead of dashboard
    return NextResponse.redirect(new URL("/", request.url));
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
