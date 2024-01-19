import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Button } from "@ui/components/ui/button";
import Image from "next/image";
import type { FC } from "react";

const StartNew: FC = ({}) => {
  return (
    <MaxWidthWrapper className="my-8 relative  pt-[100px] h-[600px]">
      <div className="w-full mx-auto h-[500px]  bg-[#43766C] grid grid-cols-2 rounded-3xl">
        <div className="col-span-1 flex flex-col gap-y-12 p-8 justify-center">
          <h3 className="text-white text-6xl font-bold">هل آنت مستعد؟</h3>
          <p className="text-white text-2xl ">
            اصنع منتجاتك الرقمية ودوراتك التدريبية اليوم وابنِ حولها أعمال
            تجارية ناجحة. لأنك تستطيع!
          </p>
          <Button
            size="lg"
            className="w-[400px] h-[70px] bg-white text-[#43766C] text-2xl font-bold "
          >
            ابدء تجربتك المجانية
          </Button>
        </div>
        <div className="col-span-1 absolute ml-20 mt-1 left-0 bottom-0  top-0 ">
          <Image
            src="/teacher.png"
            alt="teacher image"
            width={650}
            height={850}
          />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default StartNew;
