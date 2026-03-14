"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@ui/components/ui/button";
import { useTranslations } from "next-intl";
import { isAuthenticationError } from "@/src/lib/auth-error-utils";

export default function SettingsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  const t = useTranslations("dashboardError");

  if (isAuthenticationError(error)) {
    return null;
  }

  return (
    <div className="w-full min-h-[70vh] flex items-center flex-col gap-y-8 justify-center pt-12">
      <div className="w-[280px] h-[220px] flex items-center justify-center">
        <Image
          src="/error.svg"
          alt="Settings error"
          width={180}
          height={180}
        />
      </div>

      <div className="w-full max-w-xl px-4">
        <h1 className="text-xl font-bold text-center">{t("title")}</h1>
        <p className="text-sm text-muted-foreground text-center mt-2 break-words">
          {error?.message ?? t("description")}
        </p>

        <div className="w-full flex items-center justify-center gap-x-4 mt-6">
          <Button size="lg" onClick={() => reset()}>
            {t("retry")}
          </Button>
          <Link
            href="/settings"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
