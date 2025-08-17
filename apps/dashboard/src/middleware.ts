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

    "/sso-callback(.*)",
    "/api/uploadthing(.*)",
    "/api/trpc(.*)",
    "/api(.*)",

    "/cron(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
