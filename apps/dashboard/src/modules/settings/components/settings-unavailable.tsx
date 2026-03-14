"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button, buttonVariants } from "@ui/components/ui/button";

interface SettingsUnavailableProps {
  title: string;
}

export default function SettingsUnavailable({ title }: SettingsUnavailableProps) {
  const t = useTranslations("settings");

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 min-h-[200px]">
      <p className="text-muted-foreground text-center mb-6">
        {t("unavailableMessage")}
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/settings">{t("retry")}</Link>
        </Button>
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
