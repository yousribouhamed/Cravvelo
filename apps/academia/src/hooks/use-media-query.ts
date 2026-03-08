"use client";

import { useState, useEffect } from "react";

/**
 * Returns whether the given media query matches. Defaults to false during SSR
 * to avoid hydration mismatch. Use for responsive UI (e.g. sheet side, sticky footer).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
