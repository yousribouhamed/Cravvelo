import { Locale, defaultLocale } from "@/lib/i18n/config";

/**
 * Maps DB values like "ARABIC" / "ENGLISH" (and common variants) to next-intl locales.
 */
export function preferredLanguageToLocale(
  preferredLanguage: string | null | undefined
): Locale {
  if (!preferredLanguage) return defaultLocale;

  const normalized = preferredLanguage.trim().toUpperCase();

  if (normalized === "AR" || normalized === "ARABIC" || normalized === "ARABIC_LANGUAGE") {
    return "ar";
  }

  if (normalized === "EN" || normalized === "ENGLISH" || normalized === "ENGLISH_LANGUAGE") {
    return "en";
  }

  return defaultLocale;
}

