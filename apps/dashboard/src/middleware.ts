import { authMiddleware } from "@clerk/nextjs";

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
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
