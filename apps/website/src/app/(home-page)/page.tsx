// import MaxWidthWrapper from "../../components/max-width-wrapper";
// import WhatYouCanDo from "./sections/what-you-can-do";
import HeroLights from "../../components/svgs/hero-lights";
// import Pricing from "./sections/pricing";
import Hero from "./sections/hero";
// import HowPlatformWorks from "./sections/how-platform-works";
// import CreateLanch from "./sections/create-lanch";
// import EaseSpeed from "./sections/ease-speed";
// import NewExperiance from "./sections/new-experiance";
// import StartNew from "./sections/start-new";
// import SiteFooter from "@/src/components/layout/site-footer";
// import FadeIn from "@/src/components/animations/fade-in";
// import NewPricing from "./sections/new-pricing";

// diable animations on mobil

// use lazy motion

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
          <WhatYouCanDo />
        </FadeIn>
        <FadeIn>
          <WhatYouCanDo />
        </FadeIn>
        <FadeIn>
          <HowPlatformWorks />
        </FadeIn>
        <FadeIn>
          <CreateLanch />
        </FadeIn>
        <FadeIn>
          <EaseSpeed />
        </FadeIn>
        <FadeIn>
          <MaxWidthWrapper className="my-16 ">
            <div className="w-full min-h-[250px] h-fit  flex flex-col justify-center gap-y-8 pt-12  ">
              <h2 className="text-5xl font-bold text-center   leading-10">
                قدرات جديدة، بتجربة مذهلة، في
                <span className="text-[#FC6B00] relative block my-12 lg:my-0 lg:inline-block mx-8  ">
                  <div className="absolute -top-20 bottom-0 right-32 lg:-right-5 ">
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
              <div className="w-full h-[600px] rounded-2xl border  border-[#FC6B00] bg-[#F8FAE5]"></div>
            </div>
          </MaxWidthWrapper>
        </FadeIn>
        <FadeIn>
          <NewExperiance />
        </FadeIn>
        <FadeIn>
          <MaxWidthWrapper className="my-8">
            <div className="w-full min-h-[250px] h-fit  flex flex-col justify-center  gap-y-8  pt-20 ">
              <div className="w-full h-[100px] relative flex flex-col justify-center items-center">
                <div className="bg-primary rounded-2xl w-[300px] h-[70px] flex items-center justify-center -rotate-12">
                  <span className="text-white text-4xl font-bold">
                    {" "}
                    آمان🔒محتواك.
                  </span>
                </div>
                <div className="bg-[#F4EDE5]  flex items-center justify-center border-[2px] border-black rounded-2xl w-[300px] h-[70px] absolute -rotate-12 right-[25%] 2xl:-bottom-2 -bottom-4 ">
                  <span className="text-4xl font-bold"> حافظ على</span>
                  <div className="absolute -left-9 top-2">
                    <svg
                      width="51"
                      height="51"
                      viewBox="0 0 51 51"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="25.5" cy="25.5" r="25.5" fill="#FFC901" />
                      <path
                        d="M25.743 10.6855L27.9439 20.4292L36.39 15.0957L31.0565 23.5418L40.8001 25.7427L31.0565 27.9436L36.39 36.3897L27.9439 31.0562L25.743 40.7998L23.542 31.0562L15.096 36.3897L20.4295 27.9436L10.6858 25.7427L20.4295 23.5418L15.096 15.0957L23.542 20.4292L25.743 10.6855Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-center my-4 text-xl max-w-5xl mt-8 mx-auto">
                لأننا نؤمن بأن خبراتك ومحتواك هو أثمن مواردك المعرفية، نوفر لك
                أدوات تتيح حماية المحتوى من الاستخدامات غير القانونية كالنسخ
                والسرقة وغيرها.
              </p>
              <div className="w-full h-[400px] border-[#FC6B00] border   bg-[#F8FAE5] rounded-lg"></div>
            </div>
          </MaxWidthWrapper>
        </FadeIn>
        <FadeIn>
          <MaxWidthWrapper className="my-8">
            <div className="w-full min-h-[250px] h-fit  flex flex-col justify-center gap-y-8  ">
              <h2 className="text-5xl font-bold text-center">أهم المميزات</h2>
              <p className="text-center my-4 text-xl">
                إنشاء وتسويق وبيع الدورات التدريبية عبر الإنترنت، في مكان واحد.
              </p>
            </div>
            <div className="w-full min-h-[250px] h-fit grid grid-cols-1 lg:grid-cols-3 gap-10  ">
              <div className="w-full h-full border border-yellow-500 rounded-xl bg-[#F8FAE5] p-8">
                <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
                  <div className="w-[50px] h-[50px] bg-green-500" />
                  <h3 className="text-4xl font-bold  text-start">بيع</h3>
                </div>

                <p className="text-xl text-gray-700 mt-4 text-start">
                  {" "}
                  نوفر لك مجموعة من الأدوات تمكنك من النمو وبيع خبراتك بسهولة.
                </p>
              </div>

              <div className="w-full h-full border border-yellow-500 rounded-xl bg-[#F8FAE5] p-8">
                <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
                  <div className="w-[50px] h-[50px] bg-green-500" />
                  <h3 className="text-4xl font-bold  text-start">إدارة</h3>
                </div>

                <p className="text-xl text-gray-700 mt-4 text-start">
                  {" "}
                  لوحة تحكم سهلة، بتجربة مذهلة، تتيح إدارة كل دوراتك.
                </p>
              </div>

              <div className="w-full h-full border border-yellow-500 rounded-xl bg-[#F8FAE5] p-8">
                <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
                  <div className="w-[50px] h-[50px] bg-green-500" />
                  <h3 className="text-4xl font-bold  text-start">تحليل</h3>
                </div>

                <p className="text-xl text-gray-700 mt-4 text-start">
                  {" "}
                  تقارير وإحصاءات متقدمة تساعدك في الارتقاء بعملك.
                </p>
              </div>
            </div>
          </MaxWidthWrapper>
        </FadeIn>
        <FadeIn>
          <MaxWidthWrapper>
            {/* <Pricing /> */}
            <NewPricing />
          </MaxWidthWrapper>
        </FadeIn>
        <StartNew />
        {/* <SiteFooter /> */}
      </div>
    </>
  );
}
