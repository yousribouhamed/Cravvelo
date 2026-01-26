import { getUserLocale } from "@/src/services/locale";
import { locales, defaultLocale } from "./config";

export async function getServerTranslations(namespace?: string) {
  let locale = await getUserLocale();
  // Validate locale and fallback to default if invalid
  if (!locales.includes(locale as any)) {
    locale = defaultLocale;
  }
  
  const messages = (await import(`./messages/${locale}.json`)).default;
  
  if (namespace) {
    const namespaceParts = namespace.split(".");
    let result: any = messages;
    for (const part of namespaceParts) {
      result = result?.[part];
      if (result === undefined) {
        return (key: string) => key;
      }
    }
    return (key: string) => {
      // Handle dot-separated keys (e.g., "detail.name" or "emptyStates.notAvailable")
      const keyParts = key.split(".");
      let value: any = result;
      for (const part of keyParts) {
        value = value?.[part];
        if (value === undefined) {
          return key;
        }
      }
      return typeof value === "string" ? value : key;
    };
  }
  
  return (key: string) => {
    const keyParts = key.split(".");
    let result: any = messages;
    for (const part of keyParts) {
      result = result?.[part];
      if (result === undefined) {
        return key;
      }
    }
    return typeof result === "string" ? result : key;
  };
}
