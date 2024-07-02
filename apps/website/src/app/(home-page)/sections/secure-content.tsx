"use client";

import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Image from "next/image";
import type { FC } from "react";

const SecureContent: FC = ({}) => {
  return (
    <MaxWidthWrapper className="my-8 ">
      <div className="w-full min-h-[250px] h-fit  flex flex-col justify-center  gap-y-8  pt-20 ">
        <div className="w-full h-[100px] relative flex flex-col justify-center items-center">
          <div className="bg-primary rounded-2xl w-[300px] h-[70px] flex items-center justify-center -rotate-12">
            <span className="text-white text-4xl font-bold">
              {" "}
              آمان🔒محتواك.
            </span>
          </div>
          <div className="bg-[#F4EDE5]  flex items-center justify-center border-[2px] border-black rounded-2xl w-[300px] h-[70px] absolute -rotate-12 right-[9%] md:right-[25%] 2xl:-bottom-2 -bottom-16 md:-bottom-4 ">
            <span className="text-4xl font-bold"> حافظ على</span>
            <div className="absolute -left-9 top-2">
              <svg
                width="51"
                height="51"
                viewBox="0 0 51 51"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="25.5" cy="25.5" r="25.5" fill="#FFC901" />
                <path
                  d="M25.743 10.6855L27.9439 20.4292L36.39 15.0957L31.0565 23.5418L40.8001 25.7427L31.0565 27.9436L36.39 36.3897L27.9439 31.0562L25.743 40.7998L23.542 31.0562L15.096 36.3897L20.4295 27.9436L10.6858 25.7427L20.4295 23.5418L15.096 15.0957L23.542 20.4292L25.743 10.6855Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
        <p className="text-center my-4 text-xl max-w-5xl mt-20 md:mt-8 mx-auto">
          لأننا نؤمن بأن خبراتك ومحتواك هو أثمن مواردك المعرفية، نوفر لك أدوات
          تتيح حماية المحتوى من الاستخدامات غير القانونية كالنسخ والسرقة وغيرها.
        </p>
        {/* bg-[#F8FAE5] */}
        <div
          className="w-full h-[590px]    flex flex-col items-end justify-start p-8 overflow-hidden  relative rounded-2xl"
          style={{
            background:
              "linear-gradient(50deg, rgba(252, 107, 0, 1) 0%, rgba(6, 6, 6, 1) 89%, rgba(13, 13, 13, 1) 100%);",
            backgroundColor:
              "linear-gradient(50deg, rgba(252, 107, 0, 1) 0%, rgba(6, 6, 6, 1) 89%, rgba(13, 13, 13, 1) 100%);",
          }}
        >
          <Image
            alt="something"
            className="z-[80]"
            src="/folder.svg"
            width={400}
            height={400}
          />

          <div className="min-w-[250px] w-fit min-h-[50px] h-fit bg-white rounded-full shadow-2xl px-2 gap-x-2 flex items-center justify-start ml-[300px] lg:ml-[500px] z-[80]">
            <Image
              loading="eager"
              alt="something"
              src="/pen.svg"
              width={60}
              height={60}
            />

            <span className="text-lg font-bold">تعطيل نسخ النص</span>
          </div>

          <div className="min-w-[390px] w-fit mt-[70px] ml-[50px] lg:ml-[200px] min-h-[50px] h-fit bg-white rounded-full shadow-2xl px-2 gap-x-2 flex items-center justify-start z-[80]">
            <Image
              loading="eager"
              alt="something"
              src="/lock.svg"
              width={60}
              height={60}
            />
            <span className="text-lg font-bold ">
              تقييد تسجيل الدخول من جهاز واحد
            </span>
          </div>

          <div className="w-[800px] absolute top-[10px] right-[0px] bottom-0  h-full flex items-center justify-center">
            <Image
              priority
              loading="eager"
              alt="something"
              src="/flower.svg"
              width={800}
              height={800}
            />
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default SecureContent;
