"use client";

import type { FC } from "react";
import MaxWidthWrapper from "../max-width-wrapper";
import { what_to_do } from "@/src/constants/data";
import * as React from "react";

interface WhatYouCanDoAbdullahProps {}

const WhatYouCanDo: FC = ({}) => {
  const [selected, setSelected] = React.useState<number>(0);
  return (
    <MaxWidthWrapper>
      <div className="w-full h-fit ">
        <div className="max-w-2xl h-[152px]  z-20  ">
          <h1 className="text-[49px] qatar-bold text-start font-bold tracking-tight text-black sm:text-4xl">
            ما يمكنك فعله باستخدام جدارة؟
          </h1>
          <p className="mt-6   text-[25px] font-thin leading-10 text-start text-black">
            حوّل معرفتك وخبرتك إلى عمل ناجح عبر الإنترنت بسهولة وتجربة عربية
            استثنائية.
          </p>
        </div>
      </div>
      <div className="w-full h-fit min-h-[500px]  grid grid-cols-3 gap-8">
        <div className=" border border-[#FFB800]  rounded-lg p-2 col-span-2">
          <div className="w-full h-full bg-[#8000FF]" />
        </div>
        <div className="border border-[#FFB800] col-span-1 transition-all duration-100 ease-in-out bg-white grid grid-rows-4 gap-y-1  rounded-lg">
          {what_to_do.map((item, index) => (
            <div
              onClick={() => setSelected(index)}
              className={`w-[95%] mx-auto rounded-xl h-full flex cursor-pointer ${
                selected === index ? "bg-[#D7E26F]" : "bg-transparent"
              } transition-all duration-100 ease-in-out pt-2 mb-4 `}
            >
              <div className="w-[70px] h-full flex flex-col justify-start items-end pl-2  ">
                <div className="rounded-[50%] bg-[#43766C]  flex items-center justify-center w-[45px] h-[45px]">
                  {" "}
                  <item.icons />{" "}
                </div>
              </div>
              <div className="w-[calc(100%-70px)] h-fit gap-y-1 pt-2 flex flex-col justify-start  ">
                <h3 className="text-2xl font-semibold text-start">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-700 font-base leading-10 text-start">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default WhatYouCanDo;
