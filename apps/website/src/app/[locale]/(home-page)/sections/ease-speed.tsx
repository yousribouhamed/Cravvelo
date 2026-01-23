"use client";

import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { FC } from "react";

const EaseSpeed: FC = () => {
  const t = useTranslations("landing.easeSpeed.items");
  
  return (
    <MaxWidthWrapper className="my-6  w-full p-0">
      <section
        id="FEATURES2"
        className="w-full min-h-[150px] h-fit grid grid-cols-1 lg:grid-cols-3 gap-10 px-8 lg:px-0  "
      >
        <div className="w-full h-full border border-yellow-500 rounded-xl bg-[#F8FAE5] p-8">
          <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
            <Image
              alt="something"
              src="/icons/Group 11.svg"
              width={50}
              height={50}
            />

            <h3 className="text-3xl font-bold  text-start">{t("ease.title")}</h3>
          </div>
          <p className="text-xl text-[#8B8B8B] mt-4 text-start">
            {t("ease.description")}
          </p>
        </div>

        <div className="w-full h-full border border-[#FFB800] rounded-xl bg-[#F8FAE5] p-8">
          <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
            <Image
              alt="something"
              src="/icons/Group 19.svg"
              width={50}
              height={50}
            />

            <h3 className="text-3xl font-bold  text-start">{t("integrated.title")}</h3>
          </div>

          <p className="text-xl text-[#8B8B8B] mt-4 text-start">
            {t("integrated.description")}
          </p>
        </div>

        <div className="w-full h-full border border-[#FFB800] rounded-xl bg-[#F8FAE5] p-8">
          <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
            <Image
              alt="something"
              src="/icons/Group 10.svg"
              width={50}
              height={50}
            />

            <h3 className="text-3xl font-bold  text-start">{t("testing.title")}</h3>
          </div>

          <p className="text-xl text-[#8B8B8B] mt-4 text-start">
            {t("testing.description")}
          </p>
        </div>
      </section>
    </MaxWidthWrapper>
  );
};

export default EaseSpeed;
