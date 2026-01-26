import { currentUser } from "@clerk/nextjs/server";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import type { User } from "@clerk/nextjs/server";

/**
 * Validates that required Clerk environment variables are set
 */
function validateClerkEnv(): { isValid: boolean; missing: string[] } {
  const required = [
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `[Clerk] Missing required environment variables: ${missing.join(", ")}`
    );
    return { isValid: false, missing };
  }

  return { isValid: true, missing: [] };
}

// Validate on module load
const envValidation = validateClerkEnv();
if (!envValidation.isValid) {
  console.warn(
    `[Clerk] Environment validation failed. Clerk API calls may fail.`
  );
}

/**
 * Safely gets the current user from Clerk with error handling
 * Returns null on errors instead of throwing, allowing graceful handling
 *
 * @returns The current user or null if not authenticated or on error
 */
export async function getCurrentUserSafe(): Promise<User | null> {
  try {
    // Check environment variables first
    if (!envValidation.isValid) {
      console.error(
        `[Clerk] Cannot get current user: Missing environment variables: ${envValidation.missing.join(", ")}`
      );
      return null;
    }

    const user = await currentUser();
    return user;
  } catch (error) {
    // Log detailed error information for debugging
    if (isClerkAPIResponseError(error)) {
      console.error("[Clerk] API Response Error:", {
        code: error.code,
        status: error.status,
        message: error.message,
        longMessage: error.longMessage,
        clerkTraceId: error.clerkTraceId,
        errors: error.errors,
        digest: error.digest,
      });

      // If it's an authentication error (401), user is simply not authenticated
      if (error.status === 401) {
        return null;
      }

      // For other API errors, log but return null gracefully
      console.error(
        `[Clerk] API error (status: ${error.status || "unknown"}): ${error.message || "Unknown error"}`
      );
    } else {
      // Non-Clerk errors (network, etc.)
      console.error("[Clerk] Unexpected error getting current user:", error);
    }

    // Return null instead of throwing to allow graceful degradation
    return null;
  }
}

/**
 * Gets the current user and throws if there's an error
 * Use this when you need to ensure the user exists and want errors to propagate
 *
 * @throws {Error} If there's an error getting the user
 * @returns The current user
 */
export async function getCurrentUserOrThrow(): Promise<User> {
  const user = await getCurrentUserSafe();
  if (!user) {
    throw new Error("Failed to get current user from Clerk");
  }
  return user;
}

// Note: isAuthenticationError has been moved to auth-error-utils.ts
// to allow it to be used in client components without importing server-only modules
// Import it from "@/src/lib/auth-error-utils" in client components
