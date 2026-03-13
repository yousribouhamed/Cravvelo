"use client";

import { useTranslations } from "next-intl";

export function AppearancePageHeader() {
  const t = useTranslations("websiteSettings");

  return (
    <div className="rounded-xl border bg-card p-4">
      <h2 className="text-base font-semibold">{t("appearancePageTitle")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("appearancePageDescription")}
      </p>
    </div>
  );
}
