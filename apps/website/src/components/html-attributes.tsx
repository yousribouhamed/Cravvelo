"use client";

import { useEffect } from "react";

export function HtmlAttributes({ dir, lang }: { dir: string; lang: string }) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", dir);
      document.documentElement.setAttribute("lang", lang);
      document.documentElement.classList.add("!scroll-smooth");
      document.body.classList.add("min-h-screen", "h-fit", "bg-white", "w-full");
    }
  }, [dir, lang]);

  return null;
}
