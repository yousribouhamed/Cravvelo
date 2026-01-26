"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface EmptyBoxProps {}

export default function EmptyBox() {
  const t = useTranslations("apps");

  return (
    <div className="w-full h-[330px] flex flex-col justify-center items-center gap-y-5">
      <Image
        loading="eager"
        alt={t("noAppsToInstall")}
        src="/empty-box.svg"
        width={150}
        height={150}
        className="dark:opacity-80"
      />
      <p className="text-md text-center text-muted-foreground">
        {t("noAppsToInstall")}
      </p>
    </div>
  );
}
