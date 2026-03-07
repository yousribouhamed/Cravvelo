"use client";

import Image from "next/image";
import type { FC } from "react";
import PublishWebsite from "@/src/components/models/editor/publish-website";
import { useTranslations } from "next-intl";

const CreateAcademiaSection: FC = () => {
  const t = useTranslations("createAcademia");

  return (
    <div className="w-full h-[500px] my-8 shadow border rounded-xl bg-white dark:bg-[#0E0E10] flex flex-col items-center justify-center gap-y-4">
      <Image
        src="/academia/welcome.svg"
        alt={t("imageAlt")}
        width={250}
        height={250}
      />

      <h2 className="max-w-md font-bold text-gray-900 dark:text-white text-center">
        {t("heading")}
      </h2>
      <PublishWebsite />
    </div>
  );
};

export default CreateAcademiaSection;
