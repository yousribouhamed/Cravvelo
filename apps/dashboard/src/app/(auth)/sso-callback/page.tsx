"use client";

import * as React from "react";
import { useClerk } from "@clerk/nextjs";
import { type HandleOAuthCallbackParams } from "@clerk/types";

interface SSOCallbackProps {
  searchParams: Promise<HandleOAuthCallbackParams>;
}

export default function SSOCallback({ searchParams }: SSOCallbackProps) {
  const { handleRedirectCallback } = useClerk();
  const [resolvedSearchParams, setResolvedSearchParams] =
    React.useState<HandleOAuthCallbackParams | null>(null);

  React.useEffect(() => {
    const resolveSearchParams = async () => {
      try {
        const params = await searchParams;
        setResolvedSearchParams(params);
      } catch (error) {
        console.error("Error resolving search params:", error);
      }
    };

    resolveSearchParams();
  }, [searchParams]);

  React.useEffect(() => {
    if (resolvedSearchParams) {
      void handleRedirectCallback(resolvedSearchParams);
    }
  }, [resolvedSearchParams, handleRedirectCallback]);

  return (
    <div>
      <h1>مرحبًا بعودتك ...</h1>
      <p>
        أول العلم الصمت والثاني حسن الإستماع والثالث حفظه والرابع العمل به
        والخامس نشر
      </p>
    </div>
  );
}
