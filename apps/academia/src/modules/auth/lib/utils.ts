import { headers } from "next/headers";
import { verifyJWT, JWTPayload } from "./jwt";

export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const headersList = await headers();

    // Try to get user info from headers first (set by middleware)
    const userId = headersList.get("x-user-id");
    const userEmail = headersList.get("x-user-email");
    const accountId = headersList.get("x-account-id");

    if (userId && userEmail && accountId) {
      return {
        userId,
        email: userEmail,
        accountId,
      };
    }

    // Fallback: try to get from cookie and verify
    const cookieHeader = headersList.get("cookie");
    if (!cookieHeader) return null;

    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("="))
    );

    const token = cookies["auth-token"];
    if (!token) return null;

    return await verifyJWT(token);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function requireAuth(): Promise<JWTPayload> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}

export async function getTenant(): Promise<string | null> {
  try {
    const headersList = await headers();
    return headersList.get("x-tenant");
  } catch (error) {
    console.error("Error getting tenant:", error);
    return null;
  }
}
