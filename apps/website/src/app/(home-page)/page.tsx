import MaxWidthWrapper from "../../components/max-width-wrapper";
import WhatYouCanDo from "./sections/what-you-can-do";
import HeroLights from "../../components/svgs/hero-lights";
import Hero from "./sections/hero";
import CreateLanch from "./sections/create-lanch";
import EaseSpeed from "./sections/ease-speed";
import NewExperiance from "./sections/new-experiance";
import StartNew from "./sections/start-new";
import FadeIn from "@/src/components/animations/fade-in";
import NewPricing from "./sections/new-pricing";
import Image from "next/image";
import BestBenefits from "./sections/best-benifits";
import SecureContent from "./sections/secure-content";
import Footer from "@/src/components/layout/site-footer";

export default function Page() {
  return (
    <>
      <div className="  w-full h-fit min-h-full">
        <Hero />
        <HeroLights />
        <FadeIn>
          <WhatYouCanDo />
        </FadeIn>
        <FadeIn>
          <CreateLanch />
        </FadeIn>
        <FadeIn>
          <EaseSpeed />
        </FadeIn>
        <FadeIn>
          <MaxWidthWrapper className=" my-8 md:my-[200px] overflow-hidden xl:overflow-visible ">
            <div className="w-full min-h-[250px] h-fit  flex flex-col justify-center gap-y-8 pt-12  ">
              <h2 className="text-5xl font-bold text-center   leading-[4rem] md:leading-10">
                قدرات جديدة، بتجربة مذهلة، في
                <span className="text-[#FC6B00] relative block my-12 lg:my-0 lg:inline-block mx-8  ">
                  <div className="absolute -top-20 bottom-0 right-[1.5rem] md:right-32 lg:-right-5 ">
                    <svg
                      width="260"
                      height="220"
                      viewBox="0 0 384 201"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M328.091 35.1354C331.804 37.1432 335.052 38.9001 338.301 40.6569C351.758 48.1861 364.056 57.7232 373.337 71.0248C386.099 88.8441 387.491 108.922 377.05 128.749C371.713 139.039 364.288 147.07 355.703 154.098C338.765 167.65 319.738 176.183 299.783 182.96C270.547 192.748 240.615 198.018 210.219 199.775C177.27 201.783 144.554 200.026 111.838 194.504C88.1703 190.74 64.735 184.716 42.692 173.674C34.1068 169.407 25.5217 163.886 18.0967 157.36C-1.16199 140.043 -5.33856 113.189 6.95913 89.346C12.992 77.5502 21.5771 67.7622 31.0904 59.229C53.8296 38.9001 80.0491 26.1004 107.893 16.8143C146.178 4.01457 185.16 -1.2559 225.069 0.249951C251.521 1.25385 277.972 4.01457 303.496 12.0458C311.153 14.3045 318.346 17.8182 325.771 20.8299C327.627 21.5828 329.251 22.8377 330.876 24.0926C335.052 27.6062 334.82 30.6179 330.179 33.8806C329.715 34.3825 329.019 34.6335 328.091 35.1354ZM214.396 12.7987C214.396 12.5477 214.396 12.2967 214.396 12.0458C213.003 12.0458 211.379 11.7948 209.987 11.7948C177.735 12.0458 145.946 17.0653 114.854 27.1043C87.9382 35.6374 62.1827 47.6842 40.1397 67.0092C31.3225 74.7895 23.2014 83.3226 17.4006 94.1145C6.7271 114.193 10.2076 136.027 26.9139 150.082C33.1787 155.352 40.1397 159.619 47.3327 163.133C66.8233 172.921 87.4742 178.191 108.357 182.207C138.521 187.979 168.917 189.485 199.313 188.732C235.046 187.728 270.315 181.705 304.192 169.156C320.202 163.133 335.516 155.854 349.206 145.062C357.559 138.286 364.752 130.255 369.393 119.965C374.497 108.42 374.962 96.6243 368.929 85.3304C366.608 81.0638 363.592 76.7973 360.576 73.2836C350.598 61.7388 338.533 53.7076 325.075 47.4332C308.368 39.653 291.198 33.8806 273.332 30.116C249.664 24.8455 225.765 22.3357 201.866 27.6062C200.706 27.8572 199.081 28.3591 198.153 27.8572C196.529 26.8533 194.441 25.5984 193.977 24.0926C193.513 22.5867 194.905 20.077 196.065 18.8221C197.457 17.5672 199.546 17.0653 201.402 16.5633C205.81 14.8065 209.987 13.8026 214.396 12.7987ZM288.646 20.8299C300.015 24.8455 311.153 28.6101 322.522 32.6257C312.081 25.3474 300.711 22.3357 288.646 20.8299Z"
                        fill="#FC6B00"
                      />
                    </svg>
                  </div>
                  مكان واحد
                </span>
              </h2>
              <p className="text-center my-4 text-xl max-w-5xl mt-8 mx-auto">
                كل ما تحتاجه لإنشاء وبناء دورات تدريبية وبرامج تعليمية، مع
                إمكانات تخصيص عالية، وأدوات تسيير المسارات التعليمية فائقة
                الجودة، بالإضافة إلى موقع إلكتروني ومجتمع رقمي خاص، في مكان
                واحد.
              </p>

              <div className="w-full mt-8 relative h-[800px] rounded-2xl border  border-[#FC6B00] bg-[#F8FAE5]">
                <Image
                  src="/all-in-one/add-content.svg"
                  alt="add content new"
                  width={850}
                  height={550}
                  className="absolute bottom-5 left-2 md:-bottom-16 md:left-0"
                />
                <Image
                  src="/all-in-one/Group 1000005917.svg"
                  alt="add content new"
                  width={1288}
                  height={406}
                  className="absolute top-52 -left-5 md:-top-10 md:-left-10"
                />
                <Image
                  src="/all-in-one/makethisfree.svg"
                  alt="add content new"
                  width={905}
                  height={307}
                  className="absolute left-[10] md:bottom-[3.5rem] md:-right-[18rem]"
                />
                <Image
                  src="/all-in-one/permition.svg"
                  alt="add content new"
                  width={555}
                  height={84}
                  className="absolute bottom-36 md:bottom-20 md:left-0"
                />
                <Image
                  src="/all-in-one/switch.svg"
                  alt="switchs"
                  width={372}
                  height={158}
                  className="absolute bottom-80 md:bottom-[40%] md:left-[28%]"
                />
              </div>
            </div>
          </MaxWidthWrapper>
        </FadeIn>
        <FadeIn>
          <NewExperiance />
        </FadeIn>
        <FadeIn>
          <SecureContent />
        </FadeIn>
        <FadeIn>
          <MaxWidthWrapper className="my-8 ">
            <BestBenefits />
          </MaxWidthWrapper>
        </FadeIn>
        <FadeIn>
          <MaxWidthWrapper>
            <NewPricing />
          </MaxWidthWrapper>
        </FadeIn>
        <StartNew />
      </div>

      <Footer />
    </>
  );
}
