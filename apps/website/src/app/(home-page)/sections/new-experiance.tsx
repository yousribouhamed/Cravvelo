import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Image from "next/image";
import type { FC } from "react";

const NewExperiance: FC = ({}) => {
  return (
    <MaxWidthWrapper>
      <div className="w-full h-fit p-4 lg:p-0 ">
        <div className="w-full h-fit min-h-[500px] grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="   bg-[#F8FAE5] relative col-span-1 rounded-2xl">
            <Image
              src={"/woman-leanning.png"}
              alt="woman using cravvelo"
              fill
              className="rounded-2xl object-cover"
            />
          </div>
          <div className="max-w-2xl h-full flex flex-col gap-y-4 col-span-1 pt-4 z-20 space-y-6  ">
            <h1 className=" text-5xl mb-8  font-bold text-start  tracking-tight leading-[5.5rem] text-black ">
              وفّر{" "}
              <span className="text-[#FC6B00] relative inline-block ">
                <div className="absolute  -bottom-8 md:-bottom-14  right-0 left-0  ">
                  <svg
                    width="117"
                    height="45"
                    viewBox="0 0 217 77"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.4056 23.6726C59.7075 21.4954 112.009 19.3182 164.311 17.1409L209.47 15.2611L207.428 0.279166C167.766 7.14153 129.089 18.6478 91.9271 33.9909C88.3948 35.4493 85.8108 38.2961 86.4261 42.3594C86.9875 46.0671 90.07 48.9687 93.9688 48.9728C104.658 48.9839 115.015 51.4519 124.661 56.0219V42.8502C119.347 45.3557 113.42 47.4341 108.484 50.6146C102.783 54.2879 100.619 61.5324 103.159 67.7329C106.228 75.224 113.339 76.5291 120.675 76.9822C130.547 77.5918 130.51 62.3352 120.675 61.7278C119.364 61.6468 118.015 61.4055 116.703 61.3939C116.286 61.3902 117.266 61.5233 117.235 61.8051C117.117 62.8999 116.96 60.9696 117.357 62.0793C117.855 63.4689 117.489 61.1943 117.38 62.5621C117.3 63.5765 115.735 63.7416 117.485 63.06C118.28 62.7504 119.048 62.3233 119.818 61.9602C124.016 59.9807 128.215 58.0013 132.413 56.0219C137.441 53.6518 137.426 45.2249 132.413 42.8502C120.285 37.1039 107.46 33.7325 93.9688 33.7185L96.0104 48.7004C133.172 33.3574 171.849 21.8511 211.511 14.9887C220.053 13.5109 218.05 -0.350413 209.47 0.00678379C157.168 2.18395 104.866 4.36115 52.5639 6.53838L7.4056 8.4182C-2.4425 8.82815 -2.49454 24.0847 7.4056 23.6726Z"
                      fill="#FC6B00"
                    />
                  </svg>
                </div>
                تجارب
              </span>{" "}
              أفضل لطلابك
            </h1>
            <p className="mt-6  block  text-[20px]  leading-10 text-start ">
              إتاحة بوابة للطلاب احترافية لتوفير تجربة سلسة وبناء الثقة في
              دوراتك وتعزيز الولاء، بالإضافة إلى خلق ميزة تنافسية لأعمالك
              الرقمية. من خلال إتاحة :
            </p>
            <div className="w-full h-fit flex flex-col gap-y-4 ">
              <div className="w-full h-[70px] px-4 gap-x-4  flex items-center justify-start">
                <Image
                  src="/icons/lamp.svg"
                  alt="this is the image"
                  width={60}
                  height={60}
                />

                <p className="text-black font-semibold text-xl">
                  إمكانية إدارة الطالب لحسابه وإثراء تجربته
                </p>
              </div>
              <div className="w-full h-[70px] px-4 gap-x-4 flex items-center justify-start">
                <Image
                  src="/icons/Group 12.svg"
                  alt="this is the image"
                  width={60}
                  height={60}
                />

                <p className="text-black font-semibold text-xl">
                  مشاهدة الدورة{" "}
                </p>
              </div>
              <div className="w-full h-[70px] px-4  gap-x-4  flex items-center justify-start">
                <Image
                  src="/icons/ring.svg"
                  alt="this is the image"
                  width={60}
                  height={60}
                />

                <p className="text-black font-semibold text-xl">
                  مساحة مخصصة لإستلام شهاداته
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default NewExperiance;
