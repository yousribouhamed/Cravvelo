import type { FC } from "react";
import { PLANS } from "../../../constants/pricing";
import { Button } from "@ui/components/ui/button";

interface PricingAbdullahProps {}

const Pricing: FC = ({}) => {
  return (
    <div className="w-full h-[1000px] ">
      <div className="w-full h-[200px] "></div>
      <div className="w-full max-w-7xl mx-auto h-[800px] grid grid-cols-3 gap-10 ">
        {PLANS.map((item, index) => {
          return (
            <div
              key={item.plan}
              className="w-full h-full relative bg-white shadow-2xl border rounded-2xl py-2 px-4 flex flex-col "
            >
              {index === 1 && (
                <div className="bg-[#F0B110] absolute rounded-2xl -top-16 z-[-10] flex items-center justify-center  right-0 left-0  h-20 w-full ">
                  <p className="text-3xl font-bold text-black text-center">
                    لصناع المحتوى
                  </p>
                </div>
              )}
              <div className="w-full h-[100px] flex items-center justify-start gap-x-4 ">
                <svg
                  width="63"
                  height="64"
                  viewBox="0 0 83 84"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="0.413086"
                    width="82.6753"
                    height="82.6753"
                    rx="18.3723"
                    fill="#ECEBFF"
                  />
                </svg>

                <h2 className="font-bold text-3xl text-start text-black">
                  {item.plan}
                </h2>
              </div>
              <div className="w-full h-[100px] flex items-center justify-center">
                <p className="text-gray-500 text-2xl">
                  <span className="text-5xl font-bold mx-3 text-black">
                    {item.price} $
                  </span>
                  /شهرياً
                </p>
              </div>
              <Button
                size="lg"
                className="rounded-full h-14 w-[90%] text-xl font-bold mx-auto"
              >
                ابدأ تجربتك المجانية الآن
              </Button>
              <span className="text-center my-6 text-[#43766C] text-xl font-bold ">
                {item.tagline}
              </span>
              <div className="w-full h-fit ">
                {item.features.map((subitem) => (
                  <div
                    key={subitem?.text}
                    className="w-full relative my-6 pr-2 flex items-center justify-start gap-x-4"
                  >
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_690_1058)">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.99881 1.85716C9.66685 1.04111 10.9149 1.0411 11.583 1.85716L12.4111 2.86866L13.634 2.40674C14.6207 2.03408 15.7014 2.65805 15.872 3.69883L16.0835 4.98889L17.3735 5.20033C18.4143 5.37091 19.0383 6.45166 18.6656 7.4383L18.2036 8.66123L19.2152 9.48937C20.0312 10.1575 20.0312 11.4054 19.2152 12.0735L18.2036 12.9017L18.6656 14.1246C19.0383 15.1113 18.4143 16.192 17.3735 16.3626L16.0835 16.574L15.872 17.8641C15.7014 18.9049 14.6207 19.5288 13.634 19.1562L12.4111 18.6943L11.583 19.7058C10.9149 20.5218 9.66685 20.5218 8.99881 19.7058L8.17063 18.6943L6.94769 19.1562C5.96105 19.5288 4.88031 18.9049 4.70973 17.8641L4.49828 16.574L3.20823 16.3626C2.16744 16.192 1.54348 15.1113 1.91614 14.1246L2.37806 12.9017L1.36656 12.0735C0.550505 11.4054 0.550502 10.1575 1.36656 9.48937L2.37806 8.66123L1.91614 7.4383C1.54347 6.45166 2.16745 5.37091 3.20823 5.20033L4.49828 4.98889L4.70973 3.69883C4.88031 2.65805 5.96106 2.03408 6.94769 2.40674L8.17063 2.86866L8.99881 1.85716ZM9.62919 14.2942L15.4739 8.44954L14.2931 7.26874L9.0388 12.523L6.2894 9.77359L5.10859 10.9544L8.4484 14.2942C8.60498 14.4508 8.81737 14.5387 9.0388 14.5387C9.26023 14.5387 9.47264 14.4508 9.62919 14.2942Z"
                          fill="#43766C"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_690_1058">
                          <rect
                            width="20.0388"
                            height="20.0388"
                            fill="white"
                            transform="translate(0.271851 0.762695)"
                          />
                        </clipPath>
                      </defs>
                    </svg>

                    <span className="text-xl font-semibold text-black">
                      {subitem?.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;
