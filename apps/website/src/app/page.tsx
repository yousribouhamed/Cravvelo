import { Button } from "@ui/components/ui/button";
import MaxWidthWrapper from "../components/max-width-wrapper";
import TextTyper from "../components/text-typer";
import Reviews from "../components/reviews";
import WhatYouCanDo from "../components/sections/what-you-can-do";
import HeroLights from "../components/svgs/hero-lights";
import Image from "next/image";

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
      <div className="w-full my-8 py-8 h-[600px] overflow-x-hidden bg-[#43766C] flex flex-col items-center gap-y-6">
        <h2 className="text-center font-bold text-white text-5xl">
          كيف تعمل المنصة؟
        </h2>
        <div className="w-full h-[250px] relative flex items-center justify-between px-2.5 md:px-20  max-w-screen-2xl ">
          <div className="absolute top-[25px] w-full flex items-center justify-center z-10">
            <svg
              width="100%"
              height="155"
              style={{
                marginLeft: "170px",
                marginTop: "20px",
              }}
              viewBox="0 0 1233 155"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M193.828 102.5C168.146 102.5 146.556 121.033 126.731 137.358C113.344 148.381 96.1949 155 77.5 155C34.6979 155 0 120.302 0 77.5C0 34.6979 34.6979 0 77.5 0C97.4789 0 115.692 7.55991 129.435 19.9751C150.499 39.0044 173.673 61.5 202.06 61.5H492.94C521.327 61.5 544.501 39.0044 565.565 19.9752C579.308 7.55993 597.521 0 617.5 0C637.479 0 655.692 7.55992 669.435 19.9752C690.499 39.0044 713.673 61.5 742.06 61.5H1030.94C1059.33 61.5 1082.5 39.0044 1103.56 19.9752C1117.31 7.55993 1135.52 0 1155.5 0C1198.3 0 1233 34.6979 1233 77.5C1233 120.302 1198.3 155 1155.5 155C1136.81 155 1119.66 148.381 1106.27 137.358C1086.44 121.033 1064.85 102.5 1039.17 102.5H733.828C708.146 102.5 686.556 121.033 666.731 137.358C653.344 148.381 636.195 155 617.5 155C598.805 155 581.656 148.381 568.269 137.358C548.444 121.033 526.854 102.5 501.172 102.5H193.828Z"
                fill="#30ADB1"
              />
            </svg>
          </div>
          <div className="bg-yellow-400 w-[250px] h-[250px] flex items-center justify-center pr-10 rounded-full">
            <p className="text-7xl font-bold text-white z-[20]">١</p>
          </div>
          <div className="bg-yellow-400 w-[250px] h-[250px] rounded-full flex items-center justify-center">
            <p className="text-7xl font-bold text-white z-[20]  ">٢</p>
          </div>
          <div className="bg-yellow-400 w-[250px] h-[250px] rounded-full"></div>
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
        <div className="w-full h-[250px] grid grid-cols-3 gap-10  ">
          <div className="w-full h-full border-yellow-500 bg-yellow-200"></div>
          <div className="w-full h-full border-yellow-500 bg-yellow-200"></div>
          <div className="w-full h-full border-yellow-500 bg-yellow-200"></div>
        </div>
      </MaxWidthWrapper>
      <MaxWidthWrapper className="my-8">
        <div className="w-full mx-auto h-[696px] bg-[#43766C] grid grid-cols-2 rounded-3xl">
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
          <div className="col-span-1 relative">
            <Image
              src="/teacher.png"
              alt="teacher image"
              width={1000}
              height={1400}
            />
          </div>
        </div>
      </MaxWidthWrapper>

      <div className="w-full mt-8 py-8 h-[600px] overflow-x-hidden bg-[#43766C] flex flex-col items-center gap-y-6">
        <h2 className="text-center font-bold text-white text-5xl">footer</h2>
      </div>
    </>
  );
}
