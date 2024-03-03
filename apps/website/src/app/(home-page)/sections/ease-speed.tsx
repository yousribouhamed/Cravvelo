import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import type { FC } from "react";

interface EaseSpeedAbdullahProps {}

const EaseSpeed: FC = ({}) => {
  return (
    <MaxWidthWrapper className="my-6 p-4 lg:p-0">
      <div className="w-full min-h-[250px] h-fit grid grid-cols-1 lg:grid-cols-3 gap-10  ">
        <div className="w-full h-full border border-yellow-500 rounded-xl bg-[#F8FAE5] p-8">
          <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
            <div className="w-[50px] h-[50px] bg-green-500" />
            <h3 className="text-4xl font-bold  text-start">السهولة والسرعة</h3>
          </div>
          <p className="text-xl text-[#8B8B8B] mt-4 text-start">
            {" "}
            إنشاء وتصميم الدورات التدريبية وترتيب المواد التعليمية بسهولة وسرعة.
          </p>
        </div>

        <div className="w-full h-full border border-[#FFB800] rounded-xl bg-[#F8FAE5] p-8">
          <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
            <div className="w-[50px] h-[50px] bg-green-500" />
            <h3 className="text-4xl font-bold  text-start">تجربة متكاملة</h3>
          </div>

          <p className="text-xl text-[#8B8B8B] mt-4 text-start">
            {" "}
            وسائل مختلفة لنشر رسالتك وتسويقها وبيعها عبر الإنترنت بيسر وسهولة
            بالغة.
          </p>
        </div>

        <div className="w-full h-full border border-[#FFB800] rounded-xl bg-[#F8FAE5] p-8">
          <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
            <div className="w-[50px] h-[50px] bg-green-500" />
            <h3 className="text-4xl font-bold  text-start">إختبار وتتبع</h3>
          </div>

          <p className="text-xl text-[#8B8B8B] mt-4 text-start">
            {" "}
            قياس وتقييم طلابك وتتبع أدائهم والتواصل معهم بصورة فعّالة.
          </p>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default EaseSpeed;
