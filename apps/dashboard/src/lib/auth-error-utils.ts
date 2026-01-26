/**
 * Client-safe utility to detect authentication errors
 * This file can be imported in both client and server components
 */

/**
 * Determines if an error is authentication-related and should trigger a redirect to sign-in
 * This is a client-safe version that doesn't import server-only modules
 * 
 * @param error - The error to check
 * @returns true if the error is authentication-related, false otherwise
 */
export function isAuthenticationError(error: unknown): boolean {
  // Check for Clerk API authentication errors
  // We check the error structure without importing isClerkAPIResponseError
  // to avoid server-only dependencies
  if (error && typeof error === "object") {
    const err = error as any;
    
    // Check for Clerk API response error structure
    if (err.clerkError === true) {
      // 401 status indicates authentication failure
      if (err.status === 401) {
        return true;
      }
      // Check for specific Clerk error codes that indicate auth issues
      const authErrorCodes = [
        "clerk_key_invalid_code",
        "cookie_invalid_code",
        "sign_in_token_revoked_code",
      ];
      if (err.errors?.some((e: any) => authErrorCodes.includes(e.code))) {
        return true;
      }
    }
  }

  // Check for TRPC UNAUTHORIZED errors by checking the error structure
  // We can't import TRPCError in client components, so we check the shape
  if (error && typeof error === "object") {
    const err = error as any;
    if (err.code === "UNAUTHORIZED" || err.data?.code === "UNAUTHORIZED") {
      return true;
    }
  }

  // Check for AuthenticationError from withAuth
  if (
    error instanceof Error &&
    (error.name === "AuthenticationError" ||
      error.message.includes("not authenticated") ||
      error.message.includes("Authentication required") ||
      error.message.includes("User not authenticated"))
  ) {
    return true;
  }

  // Check error message for authentication-related keywords
  if (error instanceof Error) {
    const authKeywords = [
      "authentication",
      "unauthorized",
      "not authenticated",
      "sign in",
      "login required",
    ];
    const lowerMessage = error.message.toLowerCase();
    if (authKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return true;
    }
  }

  return false;
}
