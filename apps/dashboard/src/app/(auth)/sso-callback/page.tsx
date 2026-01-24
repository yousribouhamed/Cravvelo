"use client";

import * as React from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader } from "@/src/components/loader-icon";

export default function SSOCallback({ searchParams }) {
  const { handleRedirectCallback } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(true);
  const [hasRedirected, setHasRedirected] = React.useState(false);

  // Process the OAuth callback
  React.useEffect(() => {
    const processCallback = async () => {
      // Don't process if already redirected or not loaded
      if (hasRedirected || !isLoaded) {
        return;
      }

      try {
        setIsProcessing(true);
        const params = await searchParams;

        // Handle the OAuth callback and wait for completion
        await handleRedirectCallback({
          signInFallbackRedirectUrl: "/auth-callback",
          signUpFallbackRedirectUrl: "/auth-callback",
          ...params,
        });

        // Small delay to ensure Clerk state is fully updated
        // This is especially important for first-time users
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Mark processing as complete - user state will be checked in separate effect
        setIsProcessing(false);
      } catch (error) {
        console.error("OAuth callback error:", error);
        setError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
        setIsProcessing(false);
      }
    };

    if (isLoaded && !hasRedirected && !error) {
      processCallback();
    }
  }, [isLoaded, searchParams, handleRedirectCallback, hasRedirected, error]);

  // Handle redirect after successful authentication
  // This runs separately to wait for user state to update after callback processing
  React.useEffect(() => {
    if (
      isLoaded &&
      isSignedIn &&
      user &&
      !hasRedirected &&
      !isProcessing &&
      !error
    ) {
      console.log("User authenticated successfully:", {
        userId: user.id,
        currentDomain: window.location.origin,
      });

      setHasRedirected(true);
      router.push("/auth-callback");
    }
  }, [isLoaded, isSignedIn, user, hasRedirected, isProcessing, error, router]);

  // Timeout handling - if processing takes too long, show error
  React.useEffect(() => {
    if (isProcessing && !error) {
      const timeout = setTimeout(() => {
        if (!hasRedirected && !isSignedIn) {
          setError("استغرق تسجيل الدخول وقتًا طويلاً. يرجى المحاولة مرة أخرى.");
          setIsProcessing(false);
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [isProcessing, error, hasRedirected, isSignedIn]);

  // Handle error state
  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-y-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold text-red-600 mb-2">
            خطأ في تسجيل الدخول
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => router.push("/sign-in")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
            >
              العودة إلى تسجيل الدخول
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center justify-center gap-y-4">
      <Loader size={48} />
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        جاري معالجة تسجيل الدخول...
      </p>
    </div>
  );
}
