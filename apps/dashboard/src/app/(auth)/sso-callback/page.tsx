"use client";

import * as React from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { type HandleOAuthCallbackParams } from "@clerk/types";

interface SSOCallbackProps {
  searchParams: Promise<HandleOAuthCallbackParams>;
}

export default function SSOCallback({ searchParams }: SSOCallbackProps) {
  const { handleRedirectCallback } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(true);

  React.useEffect(() => {
    const processCallback = async () => {
      try {
        setIsProcessing(true);
        const params = await searchParams;

        // Handle the OAuth callback
        await handleRedirectCallback(params);
      } catch (error) {
        console.error("OAuth callback error:", error);
        setError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, handleRedirectCallback]);

  // Handle redirect after successful authentication
  React.useEffect(() => {
    if (isLoaded && isSignedIn && user && isProcessing) {
      setIsProcessing(false);
      // Redirect to the intended destination
      // You can customize this based on your app's needs
      router.push("/dashboard"); // or wherever you want to redirect after sign-in
    }
  }, [isLoaded, isSignedIn, user, router, isProcessing]);

  // Handle error state
  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-y-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-2">
            خطأ في تسجيل الدخول
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/sign-in")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة إلى تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        aria-label="Loading"
        aria-describedby="loading-description"
        className="w-full h-screen flex flex-col items-center justify-center gap-y-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          width="150"
          height="150"
        >
          <radialGradient
            id="a9"
            cx=".66"
            fx=".66"
            cy=".3125"
            fy=".3125"
            gradientTransform="scale(1.5)"
          >
            <stop offset="0" stop-color="#FC6B00"></stop>
            <stop offset=".3" stop-color="#FC6B00" stop-opacity=".9"></stop>
            <stop offset=".6" stop-color="#FC6B00" stop-opacity=".6"></stop>
            <stop offset=".8" stop-color="#FC6B00" stop-opacity=".3"></stop>
            <stop offset="1" stop-color="#FC6B00" stop-opacity="0"></stop>
          </radialGradient>
          <circle
            transform-origin="center"
            fill="none"
            stroke="url(#a9)"
            stroke-width="27"
            stroke-linecap="round"
            stroke-dasharray="200 1000"
            stroke-dashoffset="0"
            cx="100"
            cy="100"
            r="70"
          >
            <animateTransform
              type="rotate"
              attributeName="transform"
              calcMode="spline"
              dur="1.3"
              values="360;0"
              keyTimes="0;1"
              keySplines="0 0 1 1"
              repeatCount="indefinite"
            ></animateTransform>
          </circle>
          <circle
            transform-origin="center"
            fill="none"
            opacity=".2"
            stroke="#FC6B00"
            stroke-width="27"
            stroke-linecap="round"
            cx="100"
            cy="100"
            r="70"
          ></circle>
        </svg>
      </div>
      <h1>مرحبًا بعودتك ...</h1>
      <p>
        أول العلم الصمت والثاني حسن الإستماع والثالث حفظه والرابع العمل به
        والخامس نشر
      </p>
    </div>
  );
}
