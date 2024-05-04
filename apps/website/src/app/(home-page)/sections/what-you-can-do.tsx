"use client";

import type { FC } from "react";
import MaxWidthWrapper from "../../../components/max-width-wrapper";
import { what_to_do } from "@/src/constants/data";
import * as React from "react";
// bg-[#8000FF]

const WhatYouCanDo: FC = ({}) => {
  const [selected, setSelected] = React.useState<number>(0);
  return (
    <MaxWidthWrapper>
      <section id="features" className="w-full h-fit p-4 lg:p-0 ">
        <div className="max-w-2xl h-fit md:h-[152px]  my-6 md:mb-6 mb-52 z-20  ">
          <h1 className="text-[49px] qatar-bold text-start font-bold tracking-tight text-black sm:text-4xl">
            ما يمكنك فعله باستخدام جدارة؟
          </h1>
          <p className="mt-6   text-xl font-thin leading-10 text-start text-black">
            حوّل معرفتك وخبرتك إلى عمل ناجح عبر الإنترنت بسهولة وتجربة عربية
            استثنائية.
          </p>
        </div>
      </section>
      <div className="w-full h-fit min-h-[500px]  grid grid-cols-1  xl:grid-cols-3 gap-2">
        <div className=" border border-[#FFB800] bg-[#F8FAE5]  rounded-2xl p-4 xl:col-span-2">
          <div className="w-full h-full min-h-[300px]  rounded-2xl" />
        </div>
        <div className="border border-[#FFB800] col-span-1 transition-all duration-100 ease-in-out bg-white flex flex-col p-4  rounded-lg">
          {what_to_do.map((item, index) => (
            <div
              key={item.title}
              onClick={() => setSelected(index)}
              className={`w-full mx-auto rounded-xl h-full flex  cursor-pointer ${
                selected === index ? "bg-[#D7E26F]" : "bg-transparent"
              } transition-all duration-100 ease-in-out pt-2 mb-4 `}
            >
              <div className="w-[70px] h-full flex flex-col justify-start items-end pl-2  ">
                <div className="rounded-[50%] bg-[#FC6B00] mt-1  flex items-center justify-center w-[40px] h-[40px]">
                  {" "}
                  <item.icons />{" "}
                </div>
              </div>
              <div className="w-[calc(100%-70px)] h-fit gap-y-6 p-2 flex flex-col justify-start  ">
                <h3 className="text-2xl font-semibold text-start">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-700 font-base  text-start">
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
