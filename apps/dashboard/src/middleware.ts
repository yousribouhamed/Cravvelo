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

    let hostname = req.headers
      .get("host")!
      .replace(".localhost:3001", `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

    // special case for Vercel preview deployment URLs
    if (
      hostname.includes("---") &&
      hostname.endsWith(`${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
    ) {
      hostname = `${hostname.split("---")[0]}.${
        process.env.NEXT_PUBLIC_ROOT_DOMAIN
      }`;
    }

    const searchParams = req.nextUrl.searchParams.toString();
    // Get the pathname of the request (e.g. /, /about, /blog/first-post)
    const path = `${url.pathname}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    // rewrite root application to `/home` folder
    if (
      hostname === "localhost:3001" ||
      hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
    ) {
      return NextResponse.next();
    }
    // rewrite everything else to `/[domain]/[slug] dynamic route
    return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
