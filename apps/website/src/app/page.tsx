import { Button } from "@ui/components/ui/button";
import MaxWidthWrapper from "../components/max-width-wrapper";
import { Gradian } from "../components/icons";
import TextTyper from "../components/text-typer";

export default function Page() {
  return (
    <>
      <MaxWidthWrapper className="mt-8 h-fit">
        <div className=" isolate w-full h-screen hidden  pt-20 lg:block  px-6 lg:px-0">
          {/* this is the title  */}
          <div className="mx-auto w-full h-full place-items-center grid  grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
            <div className="lg:col-span-2  lg:col-start-1 lg:row-start-1 lg:ml-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 ">
              <div className="max-w-2xl h-[152px]   ">
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
                <div className="w-[445.71px] h-[174.93px] p-[31.07px] bg-white rounded-[24.86px] shadow flex-col justify-center items-start gap-[18.64px] inline-flex "></div>
              </div>
            </div>
            {/* <WaterDropGrid /> */}

            <div className="-ml-20 -mt-12   z-[10]    lg:col-start-2 lg:row-span-2 lg:row-start-1 ">
              <img
                className="w-[32rem] max-w-none rounded-xl    sm:w-[55rem]"
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
      <div className="absolute top-0 left-0 bottom-0 h-screen w-full">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1349 2595"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M502.376 2594.2C969.817 2594.2 1348.75 1979.44 1348.75 1221.1C1348.75 462.757 969.817 -152 502.376 -152C34.9356 -152 -344 462.757 -344 1221.1C-344 1979.44 34.9356 2594.2 502.376 2594.2Z"
            fill="url(#paint0_radial_342_924)"
          />
          <defs>
            <radialGradient
              id="paint0_radial_342_924"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(502.376 1221.1) scale(846.376 1373.1)"
            >
              <stop stop-color="#FFB800" stop-opacity="0.204" />
              <stop offset="1" stop-color="#FFB800" stop-opacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      {/* this is the gradian */}
      <div className="absolute -bottom-[0] z-[-5] top-0  w-full h-screen  right-0 ">
        <Gradian width="100%" height="100%" />
      </div>
      <div className="absolute -bottom-[30%] -z-10 w-full right-0  h-screen">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1390 2057"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.3" filter="url(#filter0_f_111_427)">
            <ellipse
              cx="1169"
              cy="1207.48"
              rx="696.081"
              ry="376.805"
              fill="#43766C"
            />
          </g>
          <g opacity="0.3" filter="url(#filter1_f_111_427)">
            <ellipse
              cx="1783.66"
              cy="744.64"
              rx="501.705"
              ry="271.585"
              fill="#43766C"
            />
          </g>
          <g opacity="0.3" filter="url(#filter2_f_111_427)">
            <ellipse
              cx="1336.8"
              cy="1020.15"
              rx="343.715"
              ry="285.112"
              fill="#43766C"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_111_427"
              x="0.492889"
              y="358.246"
              width="2337.02"
              height="1698.46"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="236.214"
                result="effect1_foregroundBlur_111_427"
              />
            </filter>
            <filter
              id="filter1_f_111_427"
              x="809.525"
              y="0.627998"
              width="1948.26"
              height="1488.02"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="236.214"
                result="effect1_foregroundBlur_111_427"
              />
            </filter>
            <filter
              id="filter2_f_111_427"
              x="715.19"
              y="457.142"
              width="1243.23"
              height="1126.02"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="138.949"
                result="effect1_foregroundBlur_111_427"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </>
  );
}
