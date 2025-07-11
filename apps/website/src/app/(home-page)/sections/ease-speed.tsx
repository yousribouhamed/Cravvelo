import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Image from "next/image";
import type { FC } from "react";

const EaseSpeed: FC = () => {
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

            <h3 className="text-3xl font-bold  text-start">السهولة والسرعة</h3>
          </div>
          <p className="text-xl text-[#8B8B8B] mt-4 text-start">
            {" "}
            إنشاء وتصميم الدورات التدريبية وترتيب المواد التعليمية بسهولة وسرعة.
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

            <h3 className="text-3xl font-bold  text-start">تجربة متكاملة</h3>
          </div>

          <p className="text-xl text-[#8B8B8B] mt-4 text-start">
            {" "}
            وسائل مختلفة لنشر رسالتك وتسويقها وبيعها عبر الإنترنت بيسر وسهولة
            بالغة.
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

            <h3 className="text-3xl font-bold  text-start">إختبار وتتبع</h3>
          </div>

          <p className="text-xl text-[#8B8B8B] mt-4 text-start">
            {" "}
            قياس وتقييم طلابك وتتبع أدائهم والتواصل معهم بصورة فعّالة.
          </p>
        </div>
      </section>
    </MaxWidthWrapper>
  );
};

export default EaseSpeed;
