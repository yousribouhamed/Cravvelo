"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTenantSettings, useTenantBranding } from "@/hooks/use-tenant";
import MaxWidthWrapper from "./max-with-wrapper";

const STORAGE_KEY = "academia-sales-banner-dismissed";
const DISMISS_EXPIRY_MS = 24 * 60 * 60 * 1000;

function getEndOfToday(): Date {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end;
}

function useCountdown(endTimeMs: number) {
  const [remaining, setRemaining] = useState({ hours: 0, mins: 0, secs: 0, done: false });

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const diff = endTimeMs - now;
      if (diff <= 0) {
        setRemaining({ hours: 0, mins: 0, secs: 0, done: true });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setRemaining({ hours, mins, secs, done: false });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTimeMs]);

  return remaining;
}

export default function SalesBanner() {
  const { enableSalesBanner } = useTenantSettings();
  const { primaryColor } = useTenantBranding();
  const t = useTranslations("salesBanner");

  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const timestamp = parseInt(raw, 10);
      if (!isNaN(timestamp) && Date.now() - timestamp < DISMISS_EXPIRY_MS) {
        setDismissed(true);
        return;
      }
    }
    setDismissed(false);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setDismissed(true);
  };

  const endOfTodayMs = getEndOfToday().getTime();
  const { hours, mins, secs, done } = useCountdown(endOfTodayMs);

  if (!enableSalesBanner || dismissed === null || dismissed) {
    return null;
  }

  return (
    <div
      className="relative w-full text-white shrink-0"
      style={{ backgroundColor: primaryColor || "#DC2626" }}
      role="banner"
    >
      <MaxWidthWrapper className="flex flex-wrap items-center justify-between gap-3 py-2.5 px-2.5 md:px-8 pr-10 md:pr-8">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium whitespace-nowrap">{t("message")}</span>
        </div>
        {!done && (
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold tabular-nums leading-tight">
                {String(hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs opacity-90">{t("hours")}</span>
            </div>
            <span className="text-lg font-bold opacity-80">:</span>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold tabular-nums leading-tight">
                {String(mins).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs opacity-90">{t("mins")}</span>
            </div>
            <span className="text-lg font-bold opacity-80">:</span>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold tabular-nums leading-tight">
                {String(secs).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs opacity-90">{t("secs")}</span>
            </div>
          </div>
        )}
      </MaxWidthWrapper>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1.5 rounded hover:bg-white/20 transition-colors"
        aria-label={t("dismissLabel")}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
