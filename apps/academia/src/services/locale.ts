"use server";

import { cookies, headers } from "next/headers";
import { defaultLocale, Locale, locales } from "@/lib/i18n/config";
import { getTenantWebsite } from "@/actions/tanant";
import { preferredLanguageToLocale } from "@/lib/i18n/preferred-language";

const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale() {
  const cookieLocale = (await cookies()).get(COOKIE_NAME)?.value;

  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // If no valid cookie, derive from tenant preferredLanguage (no cookie write here).
  const tenant = (await headers()).get("x-tenant");
  if (tenant) {
    const website = await getTenantWebsite(tenant);
    return preferredLanguageToLocale(website?.Account?.preferredLanguage);
  }

  return defaultLocale;
}

/**
 * NOTE: Cookies can only be modified in a Server Action or Route Handler.
 * Do not call this from Server Components like layouts/pages.
 */
export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}

