import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Public routes are routes that don't require authentication
  publicRoutes: [
    "/",
    "/auth-callback",
    "/sign-in(.*)",
    "/course-academy(.*)",
    "/products-academy(.*)",
    "/sign-up(.*)",
    "/signin(.*)",
    "/signup(.*)",
    "/auth-academy(.*)",
    "/privacy-policy(.*)",
    "/terms-of-service(.*)",
    "/sso-callback(.*)",
    "/api/uploadthing(.*)",
    "/api/trpc(.*)",
    "/api(.*)",
    "/cart(.*)",
    "/editor",
    "/students(.*)",
    "/marketing(.*)",
    "/test",
    "/student-library(.*)",
    "/student-profile(.*)",
    "/cron(.*)",
    "/product-academy(.*)",
  ],

  beforeAuth: (req) => {
    const url = req.nextUrl;

    // Get hostname from headers
    const host = req.headers.get("host");
    if (!host) {
      return NextResponse.next();
    }

    let hostname = host;

    // Replace .localhost:3001 with your root domain
    if (hostname.includes(".localhost:3001")) {
      hostname = hostname.replace(
        ".localhost:3001",
        `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
      );
    }

    // Handle Vercel preview deployment URLs
    if (
      hostname.includes("---") &&
      hostname.endsWith(`${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
    ) {
      const subdomain = hostname.split("---")[0];
      hostname = `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
    }

    const searchParams = req.nextUrl.searchParams.toString();
    const path = `${url.pathname}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    // If it's the root domain or localhost, proceed normally
    if (
      hostname === "localhost:3001" ||
      hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
    ) {
      return NextResponse.next();
    }

    // Extract subdomain for rewriting
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    let subdomain = "";

    if (hostname.endsWith(`.${rootDomain}`)) {
      subdomain = hostname.replace(`.${rootDomain}`, "");
    } else if (hostname.includes(".localhost:3001")) {
      subdomain = hostname.split(".localhost:3001")[0];
    }

    // Rewrite to dynamic route with proper URL construction
    if (subdomain) {
      const rewriteUrl = new URL(`/${subdomain}${path}`, req.url);
      return NextResponse.rewrite(rewriteUrl);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
