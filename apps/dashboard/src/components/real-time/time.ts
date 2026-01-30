type SupportedLocale = "ar" | "en";

const localeMap: Record<SupportedLocale, string> = {
  ar: "ar-DZ",
  en: "en-US",
};

function getRelativeTimeUnit(seconds: number): {
  value: number;
  unit: Intl.RelativeTimeFormatUnit;
} {
  const abs = Math.abs(seconds);

  const year = 31536000;
  const month = 2592000;
  const week = 604800;
  const day = 86400;
  const hour = 3600;
  const minute = 60;

  if (abs >= year) return { value: Math.round(seconds / year), unit: "year" };
  if (abs >= month) return { value: Math.round(seconds / month), unit: "month" };
  if (abs >= week) return { value: Math.round(seconds / week), unit: "week" };
  if (abs >= day) return { value: Math.round(seconds / day), unit: "day" };
  if (abs >= hour) return { value: Math.round(seconds / hour), unit: "hour" };
  if (abs >= minute)
    return { value: Math.round(seconds / minute), unit: "minute" };
  return { value: seconds, unit: "second" };
}

/**
 * Locale-aware relative time for notifications (EN/AR).
 */
export function timeSince(createdAt: Date, locale: SupportedLocale = "en"): string {
  const now = new Date();
  const createdDate = new Date(createdAt);

  const seconds = Math.round((createdDate.getTime() - now.getTime()) / 1000);
  // Treat very recent as “now”
  if (Math.abs(seconds) < 10) {
    return locale === "ar" ? "الآن" : "now";
  }

  const { value, unit } = getRelativeTimeUnit(seconds);
  const rtf = new Intl.RelativeTimeFormat(localeMap[locale] ?? "en-US", {
    numeric: "auto",
  });
  return rtf.format(value, unit);
}
