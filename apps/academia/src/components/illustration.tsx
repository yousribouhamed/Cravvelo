"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

const ILLUSTRATION_IDS: Record<string, number> = {
  "not-found": 1,
  error: 2,
};

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
  const id = ILLUSTRATION_IDS[name];
  if (id == null) return null;
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
    />
  );
}
