"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { FC } from "react";

interface BestBenifitsAbdullahProps {}

const BestBenefits: FC = ({}) => {
  const t = useTranslations("landing.bestBenefits");
  
  return (
    <>
      <div className="w-full min-h-[250px] h-fit  flex flex-col justify-center gap-y-8  ">
        <h2 className="text-5xl font-bold text-center">{t("title")}</h2>
        <p className="text-center my-4 text-xl">
          {t("description")}
        </p>
      </div>
      <div className="w-full min-h-[150px] h-fit grid grid-cols-1 lg:grid-cols-3 gap-10  ">
        <div className="w-full h-full border border-yellow-500 rounded-xl bg-[#F8FAE5] p-8">
          <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
            <div className="w-[70px] h-[70px] shadow rounded-2xl bg-white">
              <Image
                alt="something"
                src="/icons/Chat.png"
                width={70}
                height={70}
              />
            </div>
            <h3 className="text-4xl font-bold  text-start">{t("items.sell.title")}</h3>
          </div>

          <p className="text-xl text-gray-700 mt-4 text-start">
            {t("items.sell.description")}
          </p>
        </div>

        <div className="w-full h-full border border-yellow-500 rounded-xl bg-[#F8FAE5] p-8">
          <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
            <div className="w-[70px] h-[70px] shadow bg-white rounded-2xl ">
              <Image
                alt="something"
                src="/icons/Suitcase.png"
                width={70}
                height={70}
              />
            </div>
            <h3 className="text-4xl font-bold  text-start">{t("items.manage.title")}</h3>
          </div>

          <p className="text-xl text-gray-700 mt-4 text-start">
            {t("items.manage.description")}
          </p>
        </div>

        <div className="w-full h-full border border-yellow-500 rounded-xl bg-[#F8FAE5] p-8">
          <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
            <div className="w-[70px] h-[70px] shadow bg-white rounded-2xl ">
              <Image
                alt="something"
                src="/icons/Settings.png"
                width={70}
                height={70}
              />
            </div>
            <h3 className="text-4xl font-bold  text-start">{t("items.analyze.title")}</h3>
          </div>

          <p className="text-xl text-gray-700 mt-4 text-start">
            {t("items.analyze.description")}
          </p>
        </div>
      </div>
    </>
  );
};

export default BestBenefits;
