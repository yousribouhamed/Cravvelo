"use client";

import { useTranslations } from "next-intl";

interface HomeSectionPlaceholderProps {
  titleKey: string;
  subtitleKey: string;
}

export function HomeSectionPlaceholder({
  titleKey,
  subtitleKey,
}: HomeSectionPlaceholderProps) {
  const t = useTranslations("home.sections");
  return (
    <section className="mt-12 rounded-xl border bg-card p-6 md:p-8">
      <h2 className="text-2xl font-bold">{t(titleKey)}</h2>
      <p className="text-muted-foreground mt-1">{t(subtitleKey)}</p>
      <p className="text-muted-foreground/80 text-sm mt-4">{t("comingSoon")}</p>
    </section>
  );
}
