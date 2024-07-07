"use client";

import type { FC } from "react";
import { PLANS } from "@/src/constants/pricing";
import { Button } from "@ui/components/ui/button";
import * as React from "react";
import { Tabs } from "@/src/components/animations/animated-tabs";
import Image from "next/image";

const DISPLAY_VALUES = {
  monthly: "MONTHLY",
  yearly: "YEARLY",
};

const NewPricing: FC = ({}) => {
  const [isPaymentByMonth, setIsPaymentByMonth] =
    React.useState<boolean>(false);

  return (
    <div className="w-full min-h-[1080px] h-fit my-10 p-4 md:p-0 ">
      <div className="w-[250px] h-[50px] bg-white  shadow-2xl rounded-full mx-auto  mt-6 mb-10 md:mb-20">
        <Tabs
          setPaymentType={setIsPaymentByMonth}
          activeTabClassName={"bg-[#FC6B00] text-white "}
          // containerClassName={`w-full h-full`}
          tabs={[
            {
              title: "سنوي ",
              value: DISPLAY_VALUES.yearly,
            },
            {
              title: "  شهري",
              value: DISPLAY_VALUES.monthly,
            },
          ]}
        />
      </div>

      <div className="w-full h-fit   max-w-6xl mx-auto min-h-[800px] grid grid-cols-1 md:grid-cols-3  gap-10 ">
        {PLANS.map((item, index) => {
          return (
            <div
              key={item.plan}
              className="w-full h-[90%] relative bg-white shadow-2xl border rounded-2xl py-2 px-4 flex flex-col "
            >
              {index === 1 && (
                <div className="bg-[#FC6B00] absolute rounded-2xl -top-16 z-[-10] flex items-center justify-center  right-0 left-0  h-20 w-full ">
                  <p className="text-3xl font-bold text-white text-center">
                    لصناع المحتوى
                  </p>
                </div>
              )}
              <div className="w-full h-[100px] flex items-center justify-start gap-x-4 ">
                <div className="w-[80px] h-[70px] bg-gray-100 rounded-xl flex items-center justify-center">
                  <Image
                    src={item.imageUrl}
                    alt="this is the image url"
                    width={55}
                    height={55}
                  />
                </div>

                <h2 className="font-bold text-2xl text-start text-black">
                  {item.plan}
                </h2>
              </div>
              <div className="w-full h-[140px] flex items-center justify-center">
                <p className="text-gray-500 text-xl">
                  <span className="text-4xl font-bold mx-3  text-black">
                    DZD{" "}
                    {isPaymentByMonth
                      ? item.price
                      : Math.floor(
                          Number(item.price) - Number(item.price) * 0.2
                        )}
                  </span>
                </p>
              </div>
              <Button
                size="lg"
                className="rounded-full h-20 w-[80%] text-lg font-bold mx-auto  hover:scale-105 transition-all duration-150 "
              >
                اشترك الان
              </Button>
              <span className="text-start my-6 text-[#FC6B00] text-lg  ">
                {item.tagline}
              </span>
              <div className="w-full h-fit ">
                {item.features.map((subitem) => (
                  <div
                    key={subitem?.text}
                    className="w-full relative my-6 pr-2 flex items-center justify-start gap-x-4"
                  >
                    {subitem?.negative ? (
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 21 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_690_1110)">
                          <path
                            d="M7.99399 2.64695L8.33 2.77386L8.55754 2.49596L9.38571 1.48445L9.38573 1.48443C9.85371 0.912762 10.728 0.912721 11.1961 1.48444C11.1961 1.48444 11.1961 1.48445 11.1961 1.48445L12.0242 2.49594L12.2518 2.77387L12.5878 2.64695L13.8107 2.18503C14.502 1.92396 15.2591 2.36109 15.3786 3.09025L15.3786 3.09027L15.5901 4.38033L15.6482 4.73477L16.0026 4.79285L17.2927 5.00429C18.0218 5.12379 18.459 5.88092 18.1979 6.57215C18.1979 6.57216 18.1979 6.57217 18.1979 6.57218L17.7359 7.79509L17.609 8.13112L17.8869 8.35866L18.8985 9.18678C18.8985 9.18679 18.8985 9.18679 18.8985 9.1868C19.4701 9.65488 19.4701 10.5291 18.8985 10.9972C18.8985 10.9972 18.8985 10.9972 18.8985 10.9972L17.8869 11.8254L17.609 12.053L17.7359 12.389L18.1979 13.6118C18.459 14.3031 18.0218 15.0602 17.2927 15.1797L16.0026 15.3911L15.6482 15.4492L15.5901 15.8037L15.3787 17.0937C15.3787 17.0938 15.3787 17.0938 15.3787 17.0938C15.2591 17.8229 14.5019 18.26 13.8107 17.999L12.5878 17.5371L12.2518 17.4102L12.0242 17.6881L11.1961 18.6996L11.583 19.0163L11.1961 18.6996C10.728 19.2713 9.85372 19.2713 9.38574 18.6996L9.3857 18.6995L8.55753 17.6881L8.32999 17.4102L7.994 17.5371L6.77106 17.999C6.07982 18.2601 5.32268 17.8229 5.20317 17.0938L4.99173 15.8037L4.93364 15.4492L4.57917 15.3911L3.28913 15.1797C3.28912 15.1797 3.28912 15.1797 3.28911 15.1797C2.55999 15.0602 2.12284 14.3031 2.38391 13.6118C2.38391 13.6118 2.38392 13.6118 2.38392 13.6118L2.84583 12.389L2.97275 12.053L2.69484 11.8254L1.68334 10.9972L1.68333 10.9972C1.11162 10.5291 1.11162 9.65487 1.68333 9.18679L2.69483 8.35866L2.97275 8.13112L2.84583 7.79511L2.38392 6.57217C2.12283 5.88095 2.55998 5.1238 3.28913 5.00429L4.57918 4.79285L4.93364 4.73476L4.99173 4.38031L5.20317 3.09025L4.70976 3.00938L5.20317 3.09025C5.32268 2.3611 6.07983 1.92396 6.77105 2.18503L7.99399 2.64695Z"
                            stroke="#A2A2A2"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_690_1110">
                            <rect
                              width="20.0388"
                              height="20.0388"
                              fill="white"
                              transform="translate(0.271851 0.0732422)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    ) : (
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
                            fill="#FC6B00"
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
                    )}

                    <span
                      className={` ${
                        subitem?.negative ? "text-[#A2A2A2]" : "text-black"
                      } text-lg font-semibold `}
                    >
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

export default NewPricing;
