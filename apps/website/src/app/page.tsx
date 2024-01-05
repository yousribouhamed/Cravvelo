import { Button } from "@ui/components/ui/button";
import MaxWidthWrapper from "../components/max-width-wrapper";
import { Gradian } from "../components/icons";
import TextTyper from "../components/text-typer";

export default function Page() {
  return (
    <MaxWidthWrapper className="mt-8">
      <div className="relative isolate w-full  bg-white pt-20 px-6 lg:px-0">
        {/* this is the title  */}
        <div className="mx-auto w-full place-items-center grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2  lg:col-start-1 lg:row-start-1 lg:ml-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 ">
            <div className="lg:max-w-lg pr-4 ">
              <h1 className="mt-12 text-[49px] text-start font-bold tracking-tight text-gray-900 sm:text-4xl">
                إنشاء، بيع، إدارة <TextTyper />
              </h1>
              <h1 className="text-[49px] text-start font-bold tracking-tight text-gray-900 sm:text-4xl">
                من مكان واحد، بسهولة كبيرة
              </h1>
              <p className="mt-6 text-xl leading-[40px] text-start text-gray-700">
                من البناء بلا برمجة إلى التسويق والبيع بدون خبرة، مساق توفّر لك
                كل الأدوات التي تحتاجها لإنشاء منصتك التعليمية وتنمية أعمالك عبر
                الإنترنت.
              </p>
              <div className="w-full my-4 h-[60px] flex items-end justify-start gap-x-8">
                <Button
                  size="lg"
                  className="bg-[#43766C] text-xl py-4 px-6 text-white font-bold "
                >
                  ابدء تجربتك المجانية
                </Button>
                <span className="mt-6 text-xl leading-8  block text-gray-700">
                  14 يومًا تجريبيًّا
                </span>
              </div>
            </div>
          </div>
          {/* <WaterDropGrid /> */}

          <div className="-ml-12 -mt-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 ">
            <img
              className="w-[32rem] max-w-none rounded-xl    sm:w-[48rem]"
              src="/Snap.png"
              alt=""
            />
          </div>
        </div>

        {/* this is the gradian */}

        <div className="absolute bottom-0  w-fit -z-10 h-fit right-0 ">
          <Gradian width="600" height="600" />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
