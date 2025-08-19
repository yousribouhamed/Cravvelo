import FadeIn from "@/src/components/animations/fade-in";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import type { FC } from "react";
import NewPricing from "../(home-page)/sections/new-pricing";

const Page: FC = ({}) => {
  return (
    <div className="mt-[200px] h-fit min-h-screen">
      <FadeIn>
        <MaxWidthWrapper>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-5xl font-bold text-center">
              {" "}
              اختر الباقة المناسبة لك
            </h1>
            <p className="text-center">
              ابدأ رحلتك في إنشاء منصتك التعليمية اليوم
            </p>
          </div>
          <NewPricing />
        </MaxWidthWrapper>
      </FadeIn>
    </div>
  );
};

export default Page;
