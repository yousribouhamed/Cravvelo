"use client";

import { useTenantBranding } from "@/hooks/use-tenant";
import Image from "next/image";
import type { FC } from "react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

/** Returns true if the hex color is light (needs dark text for contrast). */
function isLightBackground(hex: string | null | undefined): boolean {
  if (!hex || typeof hex !== "string") return false;
  const cleaned = hex.replace(/^#/, "");
  if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleaned)) return false;
  let r: number, g: number, b: number;
  if (cleaned.length === 3) {
    r = parseInt(cleaned[0] + cleaned[0], 16) / 255;
    g = parseInt(cleaned[1] + cleaned[1], 16) / 255;
    b = parseInt(cleaned[2] + cleaned[2], 16) / 255;
  } else {
    r = parseInt(cleaned.slice(0, 2), 16) / 255;
    g = parseInt(cleaned.slice(2, 4), 16) / 255;
    b = parseInt(cleaned.slice(4, 6), 16) / 255;
  }
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const L =
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return L > 0.5;
}

const Banner: FC = () => {
  const { primaryColor, name: websiteName, logo } = useTenantBranding();
  const t = useTranslations("banner");

  const isLight = useMemo(
    () => isLightBackground(primaryColor ?? undefined),
    [primaryColor]
  );
  const textClass = isLight
    ? "text-neutral-900"
    : "text-white";
  const displayName = websiteName || "Academy";

  return (
    <div
      className="w-full min-h-[180px] h-[200px] md:h-[250px] rounded-xl my-6 md:my-10 grid grid-cols-1 md:grid-cols-2"
      style={{
        backgroundColor: primaryColor ?? "#FC6B00",
      }}
    >
      <div className="w-full flex flex-col gap-y-2 justify-center md:justify-between items-start p-4 md:p-6">
        <div className="flex flex-col gap-y-3 md:gap-y-4">
          {logo ? (
            <div className="relative w-28 h-14 sm:w-32 sm:h-16 shrink-0">
              <Image
                src={logo}
                alt={displayName}
                fill
                className="object-contain object-left"
              />
            </div>
          ) : null}
          <span className={`text-lg sm:text-xl md:text-2xl ${textClass}`}>
            {t("welcome")}
          </span>
          <h2 className={`text-xl sm:text-2xl md:text-4xl font-bold ${textClass}`}>
            {displayName}
          </h2>
        </div>
      </div>

      {/* Decorative column: hidden on mobile */}
      <div className={`hidden md:flex w-full h-full relative items-center justify-center overflow-hidden min-h-[120px] ${textClass}`}>
        <div className="absolute top-0 left-4">
          <svg
            width="81"
            height="69"
            viewBox="0 0 61 59"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30.5 -59C30.5 -59 28.8172 -28.6154 22.2622 -15.9354C15.7073 -3.25534 0 -3.8147e-06 0 -3.8147e-06C0 -3.8147e-06 15.7073 3.25534 22.2622 15.9354C28.8172 28.6154 30.5 59 30.5 59C30.5 59 32.1828 28.6154 38.7378 15.9354C45.2927 3.25534 61 -3.8147e-06 61 -3.8147e-06C61 -3.8147e-06 45.2927 -3.25534 38.7378 -15.9354C32.1828 -28.6154 30.5 -59 30.5 -59Z"
              fill="currentColor"
              fillOpacity="0.1"
            />
          </svg>
        </div>
        <svg
          width="120"
          height="120"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M40 0C40 0 37.793 20.5997 29.1964 29.1964C20.5997 37.793 0 40 0 40C0 40 20.5997 42.207 29.1964 50.8036C37.793 59.4003 40 80 40 80C40 80 42.207 59.4003 50.8036 50.8036C59.4003 42.207 80 40 80 40C80 40 59.4003 37.793 50.8036 29.1964C42.207 20.5997 40 0 40 0Z"
            fill="currentColor"
            fillOpacity="0.25"
          />
        </svg>

        <div className="absolute bottom-0 left-0">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40 0C40 0 37.793 20.5997 29.1964 29.1964C20.5997 37.793 0 40 0 40C0 40 20.5997 42.207 29.1964 50.8036C37.793 59.4003 40 80 40 80C40 80 42.207 59.4003 50.8036 50.8036C59.4003 42.207 80 40 80 40C80 40 59.4003 37.793 50.8036 29.1964C42.207 20.5997 40 0 40 0Z"
              fill="currentColor"
              fillOpacity="0.1"
            />
          </svg>
        </div>

        <div className="absolute right-0 top-5">
          <svg
            width="61"
            height="60"
            viewBox="0 0 61 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30.5 0C30.5 0 28.8172 15.4498 22.2622 21.8973C15.7073 28.3447 0 30 0 30C0 30 15.7073 31.6553 22.2622 38.1027C28.8172 44.5502 30.5 60 30.5 60C30.5 60 32.1828 44.5502 38.7378 38.1027C45.2927 31.6553 61 30 61 30C61 30 45.2927 28.3447 38.7378 21.8973C32.1828 15.4498 30.5 0 30.5 0Z"
              fill="currentColor"
              fillOpacity="0.1"
            />
          </svg>
        </div>

        <div className="absolute bottom-0 right-28">
          <svg
            width="80"
            height="59"
            viewBox="0 0 80 59"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40 0C40 0 37.793 30.3846 29.1964 43.0646C20.5997 55.7447 0 59 0 59C0 59 20.5997 62.2553 29.1964 74.9354C37.793 87.6154 40 118 40 118C40 118 42.207 87.6154 50.8036 74.9354C59.4003 62.2553 80 59 80 59C80 59 59.4003 55.7447 50.8036 43.0646C42.207 30.3846 40 0 40 0Z"
              fill="currentColor"
              fillOpacity="0.1"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Banner;
