export const i18n = {
  defaultLocale: "en",
  locales: ["en", "ar"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export function setLangCookie(lang, days = 7) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `lang=${lang};${expires};path=/`;
}

export function getLangCookie() {
  const name = "lang=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}

export function deleteLangCookie() {
  document.cookie = "lang=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export * from "./locales/ar/sidebar";
export * from "./locales/en/sidebar";
export * from "./locales/ar/forms-settings";
export * from "./locales/en/forms-settings";
export * from "./locales/ar/dropdowns";
export * from "./locales/en/dropdowns";
export * from "./locales/ar/modals";
export * from "./locales/en/modals";
export * from "./locales/ar/dashboard";
export * from "./locales/en/dashboard";
export * from "./locales/ar/tables";
export * from "./locales/en/tables";
