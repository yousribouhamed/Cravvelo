import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/utils";

export async function middleware(req: NextRequest) {
  // Retrieve the JWT token from the request cookies
  const token = req.cookies.get("jwt");
  // Verify the JWT token if it exists
  const verifiedToken =
    token &&
    (await verifyToken({ token: token.value }).catch((err) =>
      console.error(err)
    ));
  // If the current path is under the dashboard and the token is not verified, redirect to home
  if (req.nextUrl.pathname.startsWith("/dashboard") && !verifiedToken) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  // If the current path is home and the token is verified, redirect to dashboard
  if (req.nextUrl.pathname === "/" && verifiedToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
}
