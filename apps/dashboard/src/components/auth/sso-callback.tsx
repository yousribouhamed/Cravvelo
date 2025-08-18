"use client";

import * as React from "react";
import { useClerk } from "@clerk/nextjs";
import { type HandleOAuthCallbackParams } from "@clerk/types";

interface SSOCallbackProps {
  searchParams: HandleOAuthCallbackParams;
}

export default function SSOCallback({ searchParams }: SSOCallbackProps) {
  const { handleRedirectCallback } = useClerk();

  React.useEffect(() => {
    void handleRedirectCallback(searchParams);
  }, [searchParams, handleRedirectCallback]);

  return (
    <div
      aria-label="Loading"
      aria-describedby="loading-description"
      className="w-screeen h-screen flex flex-col bg-white items-center justify-center gap-y-4"
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
          <stop offset="0" stopColor="#FC6B00"></stop>
          <stop offset=".3" stopColor="#FC6B00" stopOpacity=".9"></stop>
          <stop offset=".6" stopColor="#FC6B00" stopOpacity=".6"></stop>
          <stop offset=".8" stopColor="#FC6B00" stopOpacity=".3"></stop>
          <stop offset="1" stopColor="#FC6B00" stopOpacity="0"></stop>
        </radialGradient>
        <circle
          style={{ transformOrigin: "center" }}
          fill="none"
          stroke="url(#a9)"
          strokeWidth="27"
          strokeLinecap="round"
          strokeDasharray="200 1000"
          strokeDashoffset="0"
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
          style={{ transformOrigin: "center" }}
          fill="none"
          opacity=".2"
          stroke="#FC6B00"
          strokeWidth="27"
          strokeLinecap="round"
          cx="100"
          cy="100"
          r="70"
        ></circle>
      </svg>
      <span className="text-xl font-bold">مرحبًا بعودتك ...</span>
      <span className="text-sm text-gray-500  ">
        أول العلم الصمت والثاني حسن الإستماع والثالث حفظه والرابع العمل به
        والخامس نشر
      </span>
    </div>
  );
}
