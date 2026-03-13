"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/illustration";
import { DATABASE_UNAVAILABLE_MESSAGE } from "@/_internals/tenant-errors";

export default function TenantError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");
  const isDatabaseUnavailable = error?.message === DATABASE_UNAVAILABLE_MESSAGE;

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <Illustration
          name="error"
          className="w-full max-w-[280px] h-auto"
          alt=""
        />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {isDatabaseUnavailable ? t("databaseUnavailableTitle") : t("title")}
          </h1>
          <p className="text-muted-foreground">
            {isDatabaseUnavailable
              ? t("databaseUnavailableDescription")
              : t("description")}
          </p>
        </div>
        <Button variant="default" size="lg" onClick={reset}>
          {t("tryAgain")}
        </Button>
      </div>
    </div>
  );
}
