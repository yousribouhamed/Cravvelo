"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
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

  useEffect(() => {
    // Only redirect after Clerk has finished loading and user is confirmed signed in
    if (isLoaded && isSignedIn) {
      router.push(redirectTo);
    }
  }, [isLoaded, isSignedIn, router, redirectTo]);

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return <LoadingScreen mode="restriction" />;
  }

  // If user is signed in, don't render children (redirect is happening)
  if (isSignedIn) {
    return <LoadingScreen mode="restriction" />;
  }

  // User is not signed in, show the public page content
  return <>{children}</>;
}
