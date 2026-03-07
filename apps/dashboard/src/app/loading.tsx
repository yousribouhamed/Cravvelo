"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";
import { LoadingSpinner } from "@/src/components/loading-spinner";

const Loading: FC = ({}) => {
  const t = useTranslations("loadingScreen.loading");

  return (
    <div className="w-full min-h-[400px] h-full flex flex-col items-center justify-center gap-y-4">
      <LoadingSpinner size={96} />
      <p className="text-gray-600 dark:text-gray-400 text-sm">{t("title")}</p>
    </div>
  );
};

export default Loading;
