"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@ui/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { Languages } from "lucide-react";
import { setUserLocale } from "@/src/services/locale";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/src/lib/i18n/config";

const languageOptions: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
];

export default function LanguageSelector() {
  const router = useRouter();
  const currentLocale = useLocale() as Locale;
  const t = useTranslations("settings.language");
  const tCommon = useTranslations("common");
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <Card className="w-full">
        <CardContent className="h-[50px] flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <p className="text-gray-900 dark:text-white font-medium">
              {tCommon("language")}
            </p>
          </div>
          <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const handleLanguageChange = async (value: Locale) => {
    if (value === currentLocale) return;

    await setUserLocale(value);
    // Refresh the page to apply the new locale and direction
    router.refresh();
  };

  const currentLanguage = languageOptions.find(
    (opt) => opt.value === currentLocale
  );

  return (
    <Card className="w-full transition-colors duration-200">
      <CardContent className="h-[70px] flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {/* Language Icon */}
          <div className="flex items-center justify-center w-5 h-5 text-gray-600 dark:text-gray-300">
            <Languages className="w-5 h-5" />
          </div>

          {/* Label */}
          <p className="text-gray-900 dark:text-white font-medium text-base">
            {tCommon("language")}
          </p>
        </div>

        {/* Select */}
        <div className="w-32">
          <Select
            value={currentLocale}
            onValueChange={handleLanguageChange}
            aria-label={t("label")}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {currentLanguage?.label || currentLocale}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
