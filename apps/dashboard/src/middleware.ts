import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes are routes that don't require authentication
  publicRoutes: [
    "/",
    "/courses",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/sso-callback(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
