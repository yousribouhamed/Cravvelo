import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import TextTyper from "@/src/components/text-typer";
import { Button } from "@ui/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

const Hero: FC = ({}) => {
  return (
    <MaxWidthWrapper className="mt-32">
      <section
        id="hero"
        className="isolate w-full h-fit min-h-[700px] pt-4 lg:pt-16 px-4 lg:px-0"
      >
        {/* Hero content grid */}
        <div className="mx-auto w-full min-h-full h-fit sm:place-items-center place-content-start grid grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          {/* Left column */}
          <div className="lg:col-span-2 z-20 lg:col-start-1 lg:row-start-1 lg:ml-auto h-fit lg:grid w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 grid-cols-1">
            <div className="w-full sm:max-w-[34rem] h-fit 2xl:max-w-2xl z-20">
              <div className="w-full mt-12">
                <h1 className="text-center sm:text-start qatar-bold tracking-tight text-black text-3xl 2xl:text-4xl flex flex-col sm:flex-row sm:items-center items-start gap-2 sm:gap-0 min-h-fit">
                  <span
                    className="whitespace-nowrap qatar-bold font-bold"
                    style={{ fontFamily: "Qatar2022 Arabic bold" }}
                  >
                    إنشاء، بيع، إدارة
                  </span>
                  <TextTyper />
                </h1>
                <h1 className="qatar-bold mt-4 sm:mt-2 text-center sm:text-start font-bold tracking-tight text-black text-3xl 2xl:text-4xl">
                  من مكان واحد، بسهولة كبيرة
                </h1>
              </div>
              <p className="mt-6 sm:mt-10 text-sm font-thin 2xl:text-lg text-center sm:text-start text-black">
                من البناء بلا برمجة إلى التسويق والبيع بدون خبرة، cravvelo توفّر
                لك كل الأدوات التي تحتاجها لإنشاء منصتك التعليمية وتنمية أعمالك
                عبر الإنترنت.
              </p>
              <div className="w-full my-4 min-h-[60px] flex flex-col sm:flex-row items-center sm:mt-8 mt-16 gap-y-6 sm:items-end justify-center sm:justify-start gap-x-8">
                <Link
                  target="_blank"
                  href={"https://beta.cravvelo.com/sign-up"}
                >
                  <Button
                    size="lg"
                    className="bg-[#FC6B00] hover:bg-[#994b13] text-xl py-6 h-14 rounded-2xl text-white qatar-bold hover:scale-105 transition-all duration-150"
                  >
                    ابدء تجربتك المجانية 👋
                  </Button>
                </Link>
                <span className="text-xl leading-8 mb-3 block text-black">
                  14 يومًا تجريبيًّا
                </span>
              </div>
              {/* <Reviews /> */}
            </div>
          </div>

          {/* Right column - Image */}
          <div className="2xl:-ml-[1rem] lg:-ml-10 h-fit sm:-ml-24 z-[10] lg:mt-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="w-[45rem] h-[450px] max-w-none rounded-xl sm:w-[40rem] xl:w-[57rem] xl:h-[700px] 2xl:w-[65rem] 2xl:h-[730px] relative">
              <Image
                fill
                className="w-full h-full rounded-xl"
                src="/hero-image.png"
                alt="hero image of the application"
                priority
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>
    </MaxWidthWrapper>
  );
};

export default Hero;
