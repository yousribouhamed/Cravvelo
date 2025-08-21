"use client";

import * as React from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CravveloSpinner } from "@/src/components/cravvelo-spinner";

export default function SSOCallback({ searchParams }) {
  const { handleRedirectCallback } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const processCallback = async () => {
      try {
        const params = await searchParams;

        // Handle the OAuth callback
        await handleRedirectCallback({
          signInFallbackRedirectUrl: "/auth-callback",
          signUpFallbackRedirectUrl: "/auth-callback",
          ...params,
        });
      } catch (error) {
        console.error("OAuth callback error:", error);
        setError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
      }
    };

    if (isLoaded) {
      processCallback();
    }
  }, [searchParams, handleRedirectCallback, isLoaded]);

  // Handle redirect after successful authentication
  React.useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      console.log("User authenticated successfully:", {
        userId: user.id,
        currentDomain: window.location.origin,
      });

      // Redirect to auth-callback page
      router.push("/auth-callback");
    }
  }, [isLoaded, isSignedIn, user, router]);

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
    <div className="w-full min-h-[400px] h-full flex items-center justify-center">
      <CravveloSpinner />
    </div>
  );
}
