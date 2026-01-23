"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/src/lib/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { locales } from "@/src/lib/i18n/config";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("footer.languages");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      // usePathname from next-intl returns the pathname without the locale prefix
      // So if we're on /en/pricing, pathname will be /pricing
      // If we're on /en, pathname will be /
      const currentPath = pathname || "/";
      
      // Construct the new path with the new locale
      const newPath = currentPath === "/" 
        ? `/${newLocale}` 
        : `/${newLocale}${currentPath}`;
      
      // Use direct navigation to ensure locale is replaced correctly
      // This prevents router.replace from treating the path as relative to current locale
      if (typeof window !== "undefined") {
        window.location.href = newPath;
      }
    });
  };

  // Helper function to safely get translation with fallback
  const getLanguageName = (loc: string) => {
    try {
      return t(loc as "en" | "fr" | "ar");
    } catch {
      // Fallback to locale code if translation is missing
      return loc.toUpperCase();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-white font-semibold text-base mb-2">
        {t("label")}
      </label>
      <Select value={locale} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 focus:ring-white/50">
          <SelectValue className="text-white">
            {getLanguageName(locale)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {getLanguageName(loc)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
