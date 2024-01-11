import type { FC } from "react";
import MaxWidthWrapper from "../max-width-wrapper";

interface WhatYouCanDoAbdullahProps {}

const WhatYouCanDo: FC = ({}) => {
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
      <div className="w-full h-fit min-h-[500px] grid grid-cols-3 gap-8">
        <div className=" border border-[#FFB800]  rounded-lg p-2 col-span-2">
          <div className="w-full h-full bg-[#8000FF]" />
        </div>
        <div className="border border-[#FFB800] col-span-1 rounded-lg"></div>
      </div>
    </MaxWidthWrapper>
  );
};

export default WhatYouCanDo;
