"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/illustration";

export default function TenantError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

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
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button variant="default" size="lg" onClick={reset}>
          {t("tryAgain")}
        </Button>
      </div>
    </div>
  );
}
