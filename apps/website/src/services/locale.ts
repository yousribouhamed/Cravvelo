"use server";

import { cookies } from "next/headers";
import { defaultLocale, Locale } from "../lib/i18n/config";

// Cookie name for storing user's locale preference
// Note: With routing-based locale, the actual locale comes from the URL,
// but we can still store user preference in cookies for future visits
const COOKIE_NAME = "NEXT_LOCALE";

/**
 * Get user's preferred locale from cookie
 * This is now mainly used for storing preferences, as the actual locale
 * comes from the URL routing with next-intl
 */
export async function getUserLocale(): Promise<Locale> {
  const cookieValue = (await cookies()).get(COOKIE_NAME)?.value;
  if (cookieValue && ["en", "fr", "ar"].includes(cookieValue)) {
    return cookieValue as Locale;
  }
  return defaultLocale;
}

/**
 * Set user's locale preference in cookie
 * Note: With routing, you should use next-intl's navigation helpers
 * (Link, redirect, useRouter) to change locales, which will update the URL
 */
export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}