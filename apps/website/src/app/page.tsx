import { Button } from "@ui/components/ui/button";
import MaxWidthWrapper from "../components/max-width-wrapper";
import TextTyper from "../components/text-typer";
import Reviews from "../components/reviews";
import WhatYouCanDo from "../components/sections/what-you-can-do";
import HeroLights from "../components/svgs/hero-lights";

export default function Page() {
  return (
    <>
      <MaxWidthWrapper className="mt-8 h-fit">
        <div className=" isolate w-full h-fit hidden  pt-20 lg:block  px-6 lg:px-0">
          {/* this is the title  */}
          <div className="mx-auto w-full min-h-full h-fit place-items-center grid z-20 grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
            <div className="lg:col-span-2 z-20  lg:col-start-1 lg:row-start-1 lg:ml-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 ">
              <div className="max-w-2xl h-[152px]  z-20  ">
                <h1 className="mt-12 text-[49px] leading-[78.40px] text-right  qatar-bold font-bold tracking-tight text-black sm:text-4xl">
                  إنشاء، بيع، إدارة <TextTyper />
                </h1>
                <h1 className="text-[49px] qatar-bold text-start font-bold tracking-tight text-black sm:text-4xl">
                  من مكان واحد، بسهولة كبيرة
                </h1>
                <p className="mt-6   text-[25px] font-thin leading-10 text-start text-black">
                  من البناء بلا برمجة إلى التسويق والبيع بدون خبرة، مساق توفّر
                  لك كل الأدوات التي تحتاجها لإنشاء منصتك التعليمية وتنمية
                  أعمالك عبر الإنترنت.
                </p>
                <div className="w-full my-4 h-[60px] flex items-end justify-start gap-x-8">
                  <Button
                    size="lg"
                    className="bg-[#43766C]  text-xl py-6  h-14 rounded-[17px]  text-white qatar-bold  hover:bg-[#61AFA0]"
                  >
                    ابدء تجربتك المجانية
                  </Button>
                  <span className="mt-6   text-xl leading-8  block text-black">
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
        <div className="w-full h-[500px] lg:hidden flex flex-col justify-center gap-y-4">
          <div className="mx-auto w-full place-items-center grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
            <div className="lg:col-span-2  lg:col-start-1 lg:row-start-1 lg:ml-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 ">
              <div className="lg:max-w-lg pr-4 ">
                <h1 className="mt-12 text-[30px] text-center qatar-bold font-bold tracking-tight text-gray-900 sm:text-4xl">
                  إنشاء، بيع، إدارة <TextTyper />
                </h1>
                <h1 className="text-[30px] qatar-bold text-center font-bold tracking-tight text-gray-900 sm:text-4xl">
                  من مكان واحد، بسهولة كبيرة
                </h1>
                <p className="mt-6 text-md leading-[40px] text-center text-gray-700">
                  من البناء بلا برمجة إلى التسويق والبيع بدون خبرة، مساق توفّر
                  لك كل الأدوات التي تحتاجها لإنشاء منصتك التعليمية وتنمية
                  أعمالك عبر الإنترنت.
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
      <HeroLights />
      <WhatYouCanDo />
      <div className="w-full my-8 py-8 h-[600px] overflow-x-hidden bg-[#61AFA0] flex flex-col items-center gap-y-6">
        <h2 className="text-center font-bold text-white text-5xl">
          كيف تعمل المنصة؟
        </h2>
        <div className="w-full h-[400px] flex items-center justify-center gap-x-8">
          <div className="bg-yellow-400 w-[300px] h-[300px] rounded-full"></div>
          <div className="bg-yellow-400 w-[300px] h-[300px] rounded-full"></div>
          <div className="bg-yellow-400 w-[300px] h-[300px] rounded-full"></div>
        </div>
      </div>
      <MaxWidthWrapper className="my-6">
        <div className="w-full h-[400px]  grid grid-cols-2 ">
          <div className="w-full h-full border-yellow-500 bg-yellow-200"></div>
          <div className=" border border-[#FFB800]  rounded-lg p-2 col-span-1">
            <div className="w-full h-full bg-[#8000FF]" />
          </div>
        </div>
      </MaxWidthWrapper>
      <MaxWidthWrapper className="my-6">
        <div className="w-full h-[250px] grid grid-cols-3 gap-10  ">
          <div className="w-full h-full border-yellow-500 bg-yellow-200"></div>
          <div className="w-full h-full border-yellow-500 bg-yellow-200"></div>
          <div className="w-full h-full border-yellow-500 bg-yellow-200"></div>
        </div>
      </MaxWidthWrapper>
      <MaxWidthWrapper className="my-8">
        <div className="w-full min-h-[250px] h-fit  flex flex-col justify-center gap-y-8  ">
          <h2 className="text-5xl font-bold text-center">
            قدرات جديدة، بتجربة مذهلة، في مكان واحد.
          </h2>
          <p className="text-center my-4 text-xl">
            كل ما تحتاجه لإنشاء وبناء دورات تدريبية وبرامج تعليمية، مع إمكانات
            تخصيص عالية، وأدوات تسيير المسارات التعليمية فائقة الجودة، بالإضافة
            إلى موقع إلكتروني ومجتمع رقمي خاص، في مكان واحد.
          </p>
          <div className="w-full h-[400px] rounded-lg border-yellow-500 bg-yellow-200"></div>
        </div>
      </MaxWidthWrapper>
      <MaxWidthWrapper>
        <div className="w-full h-fit ">
          <div className="w-full h-fit min-h-[500px] grid grid-cols-2 gap-8">
            <div className="max-w-2xl h-[152px] col-span-1  z-20  ">
              <h1 className="text-[49px] qatar-bold text-start font-bold tracking-tight text-black sm:text-4xl">
                ما يمكنك فعله باستخدام جدارة؟
              </h1>
              <p className="mt-6   text-[25px] font-thin leading-10 text-start text-black">
                حوّل معرفتك وخبرتك إلى عمل ناجح عبر الإنترنت بسهولة وتجربة عربية
                استثنائية.
              </p>
            </div>
            <div className="border border-[#FFB800] col-span-1 rounded-lg"></div>
          </div>
        </div>
      </MaxWidthWrapper>
      <MaxWidthWrapper className="my-8">
        <div className="w-full min-h-[250px] h-fit  flex flex-col justify-center gap-y-8  ">
          <h2 className="text-5xl font-bold text-center">
            قدرات جديدة، بتجربة مذهلة، في مكان واحد.
          </h2>
          <p className="text-center my-4 text-xl">
            كل ما تحتاجه لإنشاء وبناء دورات تدريبية وبرامج تعليمية، مع إمكانات
            تخصيص عالية، وأدوات تسيير المسارات التعليمية فائقة الجودة، بالإضافة
            إلى موقع إلكتروني ومجتمع رقمي خاص، في مكان واحد.
          </p>
          <div className="w-full h-[400px] rounded-lg border-yellow-500 bg-yellow-200"></div>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
