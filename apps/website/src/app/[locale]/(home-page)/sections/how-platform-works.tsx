"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";

const HowPlatformWorks: FC = ({}) => {
  const t = useTranslations("landing.howPlatformWorks");
  
  return (
    <section
      id="how_it_works"
      className="w-full my-24 py-8 h-[600px] overflow-x-hidden bg-[#FC6B00] hidden sm:flex flex-col items-center gap-y-6"
    >
      <h2 className="text-center font-bold text-white text-5xl">
        {t("title")}
      </h2>
      <div className="w-full h-[250px] relative flex items-center justify-between px-2.5 md:px-20  max-w-screen-2xl ">
        <div className="absolute top-[25px] w-full flex items-center justify-center z-10">
          <svg
            width="100%"
            height="155"
            style={{
              marginLeft: "170px",
              marginTop: "20px",
            }}
            viewBox="0 0 1233 155"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M193.828 102.5C168.146 102.5 146.556 121.033 126.731 137.358C113.344 148.381 96.1949 155 77.5 155C34.6979 155 0 120.302 0 77.5C0 34.6979 34.6979 0 77.5 0C97.4789 0 115.692 7.55991 129.435 19.9751C150.499 39.0044 173.673 61.5 202.06 61.5H492.94C521.327 61.5 544.501 39.0044 565.565 19.9752C579.308 7.55993 597.521 0 617.5 0C637.479 0 655.692 7.55992 669.435 19.9752C690.499 39.0044 713.673 61.5 742.06 61.5H1030.94C1059.33 61.5 1082.5 39.0044 1103.56 19.9752C1117.31 7.55993 1135.52 0 1155.5 0C1198.3 0 1233 34.6979 1233 77.5C1233 120.302 1198.3 155 1155.5 155C1136.81 155 1119.66 148.381 1106.27 137.358C1086.44 121.033 1064.85 102.5 1039.17 102.5H733.828C708.146 102.5 686.556 121.033 666.731 137.358C653.344 148.381 636.195 155 617.5 155C598.805 155 581.656 148.381 568.269 137.358C548.444 121.033 526.854 102.5 501.172 102.5H193.828Z"
              fill="#30ADB1"
            />
          </svg>
        </div>
        <div className="w-[250px] h-full ">
          <div className="bg-[#FFB800] w-[250px] h-[250px] flex items-center justify-center pr-10 rounded-full">
            <p className="text-7xl font-bold text-white z-[20]">{t("steps.step1.number")}</p>
          </div>
          <h1 className="text-2xl text-center font-bold my-4 text-white">
            {t("steps.step1.title")}
          </h1>
          <p className="text-base text-white my-4 text-center">
            {t("steps.step1.description")}
          </p>
        </div>
        <div className="w-[250px] h-full ">
          <div className="bg-[#FFB800] w-[250px] h-[250px] rounded-full flex items-center justify-center">
            <p className="text-7xl font-bold text-white z-[20]  ">{t("steps.step2.number")}</p>
          </div>
          <h1 className="text-2xl text-center font-bold my-4 text-white">
            {t("steps.step2.title")}
          </h1>
          <p className="text-base text-white my-4 text-center">
            {t("steps.step2.description")}
          </p>
        </div>
        <div className="w-[250px] h-full ">
          <div className="bg-[#FFB800] w-[250px] h-[250px] flex items-center justify-start pr-20 rounded-full">
            <p className="text-7xl font-bold text-white z-[20]  ">{t("steps.step3.number")}</p>
          </div>

          <h1 className="text-2xl text-center font-bold my-4 text-white">
            {t("steps.step3.title")}
          </h1>
          <p className="text-base text-white my-4 text-center">
            {t("steps.step3.description")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowPlatformWorks;
