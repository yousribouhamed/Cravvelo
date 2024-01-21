import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Reviews from "@/src/components/reviews";
import TextTyper from "@/src/components/text-typer";
import { Button } from "@ui/components/ui/button";
import type { FC } from "react";

interface heroAbdullahProps {}

const Hero: FC = ({}) => {
  return (
    <MaxWidthWrapper className="mt-8 h-fit">
      <div className=" isolate w-full h-fit hidden  pt-20 lg:block  px-6 lg:px-0">
        {/* this is the title  */}
        <div className="mx-auto w-full min-h-full h-fit place-items-center grid z-20 grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 z-20  lg:col-start-1 lg:row-start-1 lg:ml-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 ">
            <div className="max-w-2xl h-[152px]  z-20  ">
              <h1 className="mt-12 text-[49px]  text-right  qatar-bold font-bold tracking-tight text-black sm:text-4xl">
                إنشاء، بيع، إدارة <TextTyper />
              </h1>
              <h1 className="text-[49px] qatar-bold mt-2 text-start font-bold tracking-tight text-black sm:text-4xl">
                من مكان واحد، بسهولة كبيرة
              </h1>
              <p className="mt-6   text-[25px] font-thin    text-start text-black">
                من البناء بلا برمجة إلى التسويق والبيع بدون خبرة، مساق توفّر لك
                كل الأدوات التي تحتاجها لإنشاء منصتك التعليمية وتنمية أعمالك عبر
                الإنترنت.
              </p>
              <div className="w-full my-4 h-[60px] flex items-end justify-start gap-x-8">
                <Button
                  size="lg"
                  className="bg-[#43766C]  text-xl py-6  h-14 rounded-[17px]  text-white qatar-bold  hover:bg-[#61AFA0]"
                >
                  ابدء تجربتك المجانية
                </Button>
                <span className="   text-xl leading-8 mb-3  block text-black">
                  14 يومًا تجريبيًّا
                </span>
              </div>
              <Reviews />
            </div>
          </div>
          {/* <WaterDropGrid /> */}

          <div className="-ml-20 -mt-12   z-[10]  overflow-hidden  lg:col-start-2 lg:row-span-2 lg:row-start-1 ">
            <img
              className="w-[32rem] max-w-none rounded-xl    sm:w-[60rem]"
              src="/Snap.png"
              alt=""
            />
          </div>
        </div>
      </div>

      {/* this is the mobil view */}
      <div className="w-full h-screen lg:hidden flex flex-col justify-center gap-y-4">
        <div className="mx-auto w-full place-items-center grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 ">
          <div className="lg:col-span-2  lg:col-start-1 lg:row-start-1 lg:ml-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 ">
            <div className="lg:max-w-lg pr-4 ">
              <h1 className="mt-12 text-[35px] text-center qatar-bold font-bold tracking-tight text-gray-900 sm:text-4xl">
                إنشاء، بيع، إدارة <TextTyper />
              </h1>
              <h1 className="text-[35px] qatar-bold text-center font-bold tracking-tight text-gray-900 sm:text-4xl">
                من مكان واحد، بسهولة كبيرة
              </h1>
              <p className="mt-6 text-md leading-[40px] text-center text-gray-700">
                من البناء بلا برمجة إلى التسويق والبيع بدون خبرة، مساق توفّر لك
                كل الأدوات التي تحتاجها لإنشاء منصتك التعليمية وتنمية أعمالك عبر
                الإنترنت.
              </p>
              <div className="w-full my-4 h-[60px] flex flex-col items-center  justify-start gap-y-8">
                <Button
                  size="lg"
                  className="bg-[#43766C] text-xl py-4 px-6 text-white font-bold "
                >
                  ابدء تجربتك المجانية
                </Button>
                <span className="mt-6   text-xl leading-8  block text-gray-700">
                  14 يومًا تجريبيًّا
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Hero;
