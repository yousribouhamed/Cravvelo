import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Reviews from "@/src/components/reviews";
import TextTyper from "@/src/components/text-typer";
import { Button } from "@ui/components/ui/button";
import type { FC } from "react";

const Hero: FC = ({}) => {
  return (
    <MaxWidthWrapper className="mt-32">
      <div className="isolate w-full h-fit min-h-[700px] pt-4 lg:pt-16 px-4 lg:px-0">
        {/* Hero content grid */}
        <div className="mx-auto w-full min-h-full h-fit sm:place-items-center place-content-start grid grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          {/* Left column */}
          <div className="lg:col-span-2 z-20 lg:col-start-1 lg:row-start-1 lg:ml-auto lg:grid w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 grid-cols-1">
            <div className="w-full sm:max-w-[34rem] 2xl:max-w-2xl z-20">
              <div className="w-full sm:min-h-[100px] sm:h-fit h-[250px] mt-12 overflow-hidden">
                <h1 className="text-center sm:text-start qatar-bold font-bold tracking-tight text-black text-3xl 2xl:text-4xl">
                  إنشاء، بيع، إدارة <TextTyper />
                </h1>
                <h1 className="qatar-bold mt-2 text-center sm:text-start font-bold tracking-tight text-black text-3xl 2xl:text-4xl">
                  من مكان واحد، بسهولة كبيرة
                </h1>
              </div>
              <p className="sm:mt-10 text-md font-thin 2xl:text-lg text-center sm:text-start text-black">
                من البناء بلا برمجة إلى التسويق والبيع بدون خبرة، مساق توفّر لك
                كل الأدوات التي تحتاجها لإنشاء منصتك التعليمية وتنمية أعمالك عبر
                الإنترنت.
              </p>

              <div className="w-full my-4 h-[60px] flex flex-col sm:flex-row items-center mt-8 gap-y-6 sm:items-end justify-center sm:justify-start gap-x-8">
                <Button
                  size="lg"
                  className="bg-[#43766C] text-xl py-6 h-14 rounded-2xl text-white qatar-bold hover:bg-[#61AFA0] hover:scale-105 transition-all duration-150 "
                >
                  ابدء تجربتك المجانية
                </Button>
                <span className="text-xl leading-8 mb-3 block text-black">
                  14 يومًا تجريبيًّا
                </span>
              </div>

              <Reviews />
            </div>
          </div>

          {/* Right column - Image */}
          <div className="xl:ml-20 lg:-ml-10 h-fit sm:-ml-24 z-[10] lg:mt-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <img
              className="w-[32rem] max-w-none rounded-xl sm:w-[40rem] xl:w-[57rem] 2xl:w-[60rem]"
              src="/Snap.png"
              alt="hero image of the application"
            />
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Hero;
