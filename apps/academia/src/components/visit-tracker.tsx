"use client";

import { useEffect } from "react";

function getOrCreateSessionId(tenant: string): string {
  if (typeof window === "undefined") return "";
  const key = `academia_session_${tenant}`;
  try {
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID?.() ?? `s${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return "";
  }
}

interface VisitTrackerProps {
  tenant: string;
}

/**
 * Sends one request per session to /api/track-visit with a stable sessionId.
 * Backend counts at most one visit per (website, sessionId); refreshes do not add visits.
 */
export function VisitTracker({ tenant }: VisitTrackerProps) {
  useEffect(() => {
    if (!tenant) return;
    const sessionId = getOrCreateSessionId(tenant);
    if (!sessionId) return;
    const params = new URLSearchParams({
      tenant,
      sessionId,
    });
    fetch(`/api/track-visit?${params.toString()}`, {
      method: "GET",
      keepalive: true,
    }).catch(() => {});
  }, [tenant]);

  return null;
}
