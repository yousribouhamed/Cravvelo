"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

const ILLUSTRATION_IDS: Record<string, number> = {
  "not-found": 1,
  error: 2,
};

/** Placeholder when the illustration image fails to load (e.g. 404) */
function IllustrationPlaceholder({
  className,
  width,
  height,
}: {
  className?: string;
  width: number;
  height: number;
}) {
  return (
    <div
      className={className}
      style={{ width, height }}
      aria-hidden
      role="img"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 219"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-muted-foreground/40"
      >
        <rect
          width="280"
          height="180"
          x="10"
          y="20"
          rx="12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
        />
        <circle cx="150" cy="100" r="24" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path
          d="M120 140 L150 110 L180 140 L150 170 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  );
}

interface IllustrationProps {
  name: keyof typeof ILLUSTRATION_IDS;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export function Illustration({
  name,
  className,
  alt = "",
  width = 300,
  height = 219,
}: IllustrationProps) {
  const { resolvedTheme } = useTheme();
  const [failed, setFailed] = useState(false);
  const id = ILLUSTRATION_IDS[name];
  if (id == null) return null;

  if (failed) {
    return (
      <IllustrationPlaceholder
        className={className}
        width={width}
        height={height}
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const basename = `${id}${isDark ? "-dark" : ""}`;
  const src = `/illustrations/${basename}.svg`;
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized
      aria-hidden={!alt}
      onError={() => setFailed(true)}
    />
  );
}
