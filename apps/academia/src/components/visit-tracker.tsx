"use client";

import { useEffect } from "react";

interface VisitTrackerProps {
  tenant: string;
}

/**
 * Fires a single request to /api/track-visit on mount to increment
 * WebsiteAnalytics visits/pageViews for the current tenant and date.
 */
export function VisitTracker({ tenant }: VisitTrackerProps) {
  useEffect(() => {
    if (!tenant) return;
    fetch(`/api/track-visit?tenant=${encodeURIComponent(tenant)}`, {
      method: "GET",
      keepalive: true,
    }).catch(() => {
      // Fire-and-forget; ignore errors (e.g. network, 4xx/5xx)
    });
  }, [tenant]);

  return null;
}
