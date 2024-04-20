import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/utils";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt");

  const verifiedToken =
    token &&
    (await verifyToken({ token: token.value }).catch((err) =>
      console.error(err)
    ));

  if (!verifiedToken) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*"],
};
