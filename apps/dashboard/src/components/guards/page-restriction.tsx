"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import { LoadingScreen } from "../loading-screen";

interface PublicPageRestrictionGuardProps {
  redirectTo?: string;
}

export default function PublicPageRestrictionGuard({
  children,
  redirectTo = "/",
}: PropsWithChildren<PublicPageRestrictionGuardProps>) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Only redirect after Clerk has finished loading and user is confirmed signed in
    if (isLoaded && isSignedIn && !isRedirecting) {
      // Add a small delay to ensure Clerk state is stable
      const timeoutId = setTimeout(() => {
        setIsRedirecting(true);
        router.replace(redirectTo);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isLoaded, isSignedIn, router, redirectTo, isRedirecting]);

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return <LoadingScreen mode="restriction" />;
  }

  // If user is signed in or we're redirecting, show loading
  if (isSignedIn || isRedirecting) {
    return <LoadingScreen mode="restriction" />;
  }

  // User is not signed in, show the public page content
  return <>{children}</>;
}
