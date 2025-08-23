import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// JWT Secret - should match your server actions
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
);

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/admin/login",
  "/admin/signup",
  "/admin/forgot-password",
  "/admin/reset-password",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/health",
  "/favicon.ico",
  "/_next",
  "/static",
];

// Define routes that require authentication
const PROTECTED_ROUTES = [
  "/admin/dashboard",
  "/admin/users",
  "/admin/courses",
  "/admin/products",
  "/admin/payments",
  "/admin/analytics",
  "/admin/settings",
  "/admin/profile",
  "/api/admin",
];

// Define routes that require specific roles or permissions
const ROLE_BASED_ROUTES: Record<string, string[]> = {
  "/admin/settings": ["SUPER_ADMIN"],
  "/admin/users/create": ["SUPER_ADMIN", "ADMIN"],
  "/admin/system": ["SUPER_ADMIN"],
  "/api/admin/users": ["SUPER_ADMIN", "ADMIN"],
  "/api/admin/system": ["SUPER_ADMIN"],
};

// Helper function to check if route is public
const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some((route) => {
    if (route.endsWith("*")) {
      return pathname.startsWith(route.slice(0, -1));
    }
    return pathname === route || pathname.startsWith(route);
  });
};

// Helper function to check if route is protected
const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some((route) => {
    return pathname.startsWith(route);
  });
};

// Helper function to check role-based access
const hasRoleAccess = (pathname: string, userRole: string): boolean => {
  const requiredRoles = ROLE_BASED_ROUTES[pathname];
  if (!requiredRoles) return true; // No specific role required
  return requiredRoles.includes(userRole);
};

// Helper function to verify JWT token
async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

// Helper function to check if user has specific permission
const hasPermission = (
  userPermissions: any,
  requiredPermission: string
): boolean => {
  if (!userPermissions || typeof userPermissions !== "object") return false;
  return userPermissions[requiredPermission] === true;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin-token")?.value;

  // Skip middleware for static files and API routes that don't need auth
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes("/favicon.ico") ||
    pathname.includes(".") // Skip files with extensions
  ) {
    return NextResponse.next();
  }

  console.log(`Middleware: Processing ${pathname}`);

  // Handle public routes
  if (isPublicRoute(pathname)) {
    // If user is already authenticated and tries to access login page, redirect to dashboard
    if (
      token &&
      (pathname === "/admin/login" || pathname === "/admin/signup")
    ) {
      const payload = await verifyAuthToken(token);
      if (payload) {
        const dashboardUrl = new URL("/admin/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    // Check if token exists
    if (!token) {
      console.log("Middleware: No token found, redirecting to login");
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token
    const payload = await verifyAuthToken(token);
    if (!payload) {
      console.log("Middleware: Invalid token, redirecting to login");
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);

      // Clear invalid token
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin-token");
      return response;
    }

    // Check if user is active (you might want to make an additional DB check here)
    const userRole = payload.role as string;
    const userPermissions = payload.permissions;

    // Check role-based access
    if (!hasRoleAccess(pathname, userRole)) {
      console.log(`Middleware: Insufficient role permissions for ${pathname}`);
      const unauthorizedUrl = new URL("/admin/unauthorized", request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }

    // Check specific permissions for certain routes
    const permissionChecks: Record<string, string> = {
      "/admin/users/delete": "delete_users",
      "/admin/courses/delete": "delete_courses",
      "/admin/products/delete": "delete_products",
      "/admin/payments/refund": "refund_payments",
    };

    const requiredPermission = permissionChecks[pathname];
    if (
      requiredPermission &&
      !hasPermission(userPermissions, requiredPermission)
    ) {
      console.log(`Middleware: Insufficient permissions for ${pathname}`);
      const unauthorizedUrl = new URL("/admin/unauthorized", request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }

    // Add user info to headers for server components to access
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-admin-id", payload.id as string);
    requestHeaders.set("x-admin-email", payload.email as string);
    requestHeaders.set("x-admin-role", userRole);
    requestHeaders.set("x-admin-permissions", JSON.stringify(userPermissions));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // For all other routes, continue normally
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\..*).+)",
  ],
};
