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

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "cravvelo.com";

function normalizeHost(host: string | null): string {
  if (!host) return "";
  return host.toLowerCase().split(":")[0];
}

function isRootOrWwwHost(host: string): boolean {
  return host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`;
}

function isPlatformSubdomainHost(host: string): boolean {
  return host.endsWith(`.${ROOT_DOMAIN}`) && !isRootOrWwwHost(host);
}

async function getCanonicalHost(
  request: NextRequest,
  host: string
): Promise<string | null> {
  if (!isPlatformSubdomainHost(host)) {
    return null;
  }

  try {
    const lookupUrl = new URL("/api/tenant/canonical", request.url);
    lookupUrl.searchParams.set("host", host);

    const response = await fetch(lookupUrl.toString(), {
      headers: {
        "x-canonical-lookup": "1",
      },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { canonicalHost?: string | null };
    return data.canonicalHost || null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const hostname = normalizeHost(
    request.headers.get("x-forwarded-host") || request.headers.get("host")
  );
  const { pathname } = request.nextUrl;

  // ========================================
  // 1. TENANT ROUTING LOGIC
  // ========================================

  const isLocalhost =
    hostname === "localhost" || hostname.endsWith(".localhost");

  let response: NextResponse;
  let tenantKey: string | null = null;
  let rewrittenUrl: URL | null = null;

  // Handle localhost (development environment)
  if (isLocalhost) {
    // Check if there's an explicit subdomain (e.g., "twice.localhost")
    if (hostname.endsWith(".localhost")) {
      const localSubdomain = hostname.replace(".localhost", "");
      const sanitizedSubdomain = localSubdomain.replace(/[^a-zA-Z0-9-]/g, "");
      if (sanitizedSubdomain) {
        tenantKey = `${sanitizedSubdomain}.${ROOT_DOMAIN}`;
      }
    } else {
      // No subdomain: use default tenant for development
      tenantKey =
        process.env.NODE_ENV === "development" ? `twice.${ROOT_DOMAIN}` : null;
    }

    if (tenantKey) {
      // Rewrite to the tenant-specific path (URL stays the same in browser)
      const url = request.nextUrl.clone();
      url.pathname = `/tenant/${tenantKey}${url.pathname}`;
      rewrittenUrl = url;
      response = NextResponse.rewrite(url);
    } else {
      response = NextResponse.next();
    }
  } else if (isRootOrWwwHost(hostname)) {
    // Root marketing/auth app (non-tenant host)
    const isPublicRoute = isRoutePublic(pathname);
    if (!isPublicRoute && !pathname.startsWith("/api")) {
      return handleAuthentication(request);
    }
    return NextResponse.next();
  } else {
    const canonicalHost = await getCanonicalHost(request, hostname);
    if (canonicalHost && canonicalHost !== hostname) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.protocol = "https:";
      redirectUrl.host = canonicalHost;
      return NextResponse.redirect(redirectUrl, 308);
    }

    // Any non-root production host is treated as tenant host (subdomain or custom domain)
    if (hostname) {
      tenantKey = hostname;
      // Rewrite to the tenant-specific path
      const url = request.nextUrl.clone();
      url.pathname = `/tenant/${tenantKey}${url.pathname}`;
      rewrittenUrl = url;
      response = NextResponse.rewrite(url);
    } else {
      response = NextResponse.next();
    }
  }

  // Prepare base headers for server components (e.g., locale resolution).
  // Tenant lookups in DB use a full host key (subdomain or custom domain).
  const baseRequestHeaders = new Headers(request.headers);
  if (tenantKey) {
    baseRequestHeaders.set("x-tenant", tenantKey);
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
    } catch {
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
  if (payload || tenantKey) {
    const requestHeaders = new Headers(baseRequestHeaders);

    if (payload) {
      requestHeaders.set("x-user-id", payload.userId);
      requestHeaders.set("x-user-email", payload.email);
      requestHeaders.set("x-account-id", payload.accountId);
    }

    // For tenant routes, create proper rewrite with headers
    if (tenantKey) {
      const url = request.nextUrl.clone();
      url.pathname = `/tenant/${tenantKey}${pathname}`;
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
    } catch {
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
