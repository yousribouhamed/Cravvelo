"use client";

import type { FC } from "react";
import MaxWidthWrapper from "../../../components/max-width-wrapper";
import { what_to_do } from "@/src/constants/data";
import * as React from "react";
import Image from "next/image";
// bg-[#8000FF]

const PREVIEW_ITEM = [
  {
    jsk: () => (
      <div className=" border  bg-[#F8FAE5]  overflow-hidden flex flex-col items-end p-12  w-full h-full min-h-[300px]  relative  rounded-2xl  xl:col-span-2">
        <Image
          src={"/preview/common/image-01.png"}
          fill
          loading="eager"
          className=""
          alt="image preview"
        />

        <div className="  w-[300px] h-[300px] md:w-[492px] md:h-[452px]  relative   z-[10]">
          <img
            alt="preview"
            src="/preview/firstimage/mac-book.svg"
            className="z-[11] absolute top-3 left-5 md:w-[90px] md:h-[20px] h-[15px] w-[70px]"
          />
          <Image
            src={"/preview/firstimage/create.png"}
            loading="eager"
            alt="image ya image"
            className=""
            fill
          />
        </div>
        <img
          alt="preview"
          src="/preview/firstimage/image-03.png"
          className="z-[11] absolute bottom-1 right-4  md:bottom-16 md:right-28 w-[200px] h-[50px]"
        />
      </div>
    ),
  },
  {
    jsk: () => (
      <div className=" border  bg-[#F8FAE5]  overflow-hidden flex flex-col items-end  pl-0  w-full h-full min-h-[300px]  relative  rounded-2xl  xl:col-span-2">
        <Image
          src={"/preview/image-02/background-image.png"}
          fill
          loading="eager"
          className=""
          alt="image preview"
        />

        <div className="  w-[720px] h-[574px] relative   z-[10]">
          <Image
            src={"/preview/image-02/image-content.png"}
            loading="eager"
            alt="image ya image"
            className=""
            fill
          />
        </div>
      </div>
    ),
  },
  {
    jsk: () => (
      <div className=" border  bg-[#F8FAE5]  overflow-hidden flex flex-col items-end  pl-0  w-full h-full min-h-[300px]  relative  rounded-2xl  xl:col-span-2">
        <Image
          src={"/preview/image-02/background-image.png"}
          fill
          loading="eager"
          className=""
          alt="image preview"
        />

        <div className="  w-[720px] h-[574px] relative   z-[10]">
          <Image
            src={"/preview/image-03/graph-image.svg"}
            loading="eager"
            alt="image ya image"
            className=""
            fill
          />
        </div>
      </div>
    ),
  },
  {
    jsk: () => (
      <div className=" border  bg-[#F8FAE5]  overflow-hidden flex flex-col items-end  pl-0  w-full h-full min-h-[300px]  relative  rounded-2xl  xl:col-span-2">
        <Image
          src={"/preview/image-02/background-image.png"}
          fill
          loading="eager"
          className=""
          alt="image preview"
        />

        <div className="  w-[720px] h-[574px] relative   z-[10]">
          <Image
            src={"/preview/image-02/image-content.png"}
            loading="eager"
            alt="image ya image"
            className=""
            fill
          />
        </div>
      </div>
    ),
  },
];

const WhatYouCanDo: FC = () => {
  const [selected, setSelected] = React.useState<number>(0);
  return (
    <MaxWidthWrapper>
      <section id="features" className="w-full h-fit p-4 lg:p-0 ">
        <div className="max-w-2xl h-fit md:h-[152px]  my-6 md:mb-6  mb-16 z-20   ">
          <h1 className="text-4xl qatar-bold text-start font-bold tracking-tight text-black ">
            ما يمكنك فعله باستخدام جدارة؟
          </h1>
          <p className="mt-6   text-xl font-thin leading-10 text-start text-black">
            حوّل معرفتك وخبرتك إلى عمل ناجح عبر الإنترنت بسهولة وتجربة عربية
            استثنائية.
          </p>
        </div>
      </section>
      <div className="w-full h-fit min-h-[500px]   grid grid-cols-1  xl:grid-cols-3 gap-2">
        {PREVIEW_ITEM[selected].jsk()}
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
                <Image
                  src={`/what-you-can-do${item.icon_url}`}
                  alt="icon image"
                  width={40}
                  height={40}
                />
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
