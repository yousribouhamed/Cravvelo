"use client";

import Script from "next/script";
import { useCallback } from "react";

interface FacebookPixelProps {
  pixelId: string | null;
}

/**
 * Loads the Facebook Pixel script and fires init + PageView when pixelId is set.
 * Renders nothing when pixelId is null/empty.
 */
export function FacebookPixel({ pixelId }: FacebookPixelProps) {
  const onLoad = useCallback(() => {
    if (!pixelId || typeof window.fbq !== "function") return;
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }, [pixelId]);

  if (!pixelId || !pixelId.trim()) {
    return null;
  }

  return (
    <Script
      src="https://connect.facebook.net/en_US/fbevents.js"
      strategy="afterInteractive"
      onLoad={onLoad}
    />
  );
}
