import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import type { FC } from "react";
import ContactUsForm from "./_components/forms/contact-us-form";
import Footer from "@/src/components/layout/site-footer";

const Page: FC = ({}) => {
  return (
    <>
      <MaxWidthWrapper>
        <div className="w-full h-fit min-h-screen mt-[100px] md:mt-[140px] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Contact Info */}
          <div className="w-full h-full col-span-1 flex flex-col items-center lg:items-start justify-start gap-y-16 lg:gap-y-20 pt-[60px] lg:pt-[80px] px-4 lg:px-0">
            {/* Header Section */}
            <div className="w-full flex items-center justify-center lg:justify-start">
              <div className="relative flex items-center justify-start gap-x-4">
                <div className="bg-[#FC6B00] rotate-6 p-4 flex items-center justify-center w-[100px] h-[50px] rounded-xl shadow-lg transition-transform hover:rotate-3 hover:scale-105">
                  <span className="text-white font-bold text-xl">تواصل</span>
                </div>
                <div className="bg-[#FFC901] p-4 -rotate-12 flex items-center justify-center absolute right-[5.5rem] -top-5 w-[100px] h-[50px] rounded-xl shadow-lg transition-transform hover:-rotate-6 hover:scale-105">
                  <span className="text-black font-bold text-xl">معنا</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col gap-y-6 w-full max-w-[400px]">
              {/* Email */}
              <div className="w-full h-[80px] rounded-xl bg-[#E8EEAA] flex items-center justify-between gap-x-4 px-6 shadow-md hover:shadow-lg transition-shadow group">
                <div className="w-[50px] h-[50px] bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <svg
                    width="19"
                    height="14"
                    viewBox="0 0 19 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.350475 2.26187C0.462982 1.7689 0.739554 1.32873 1.13489 1.01348C1.53024 0.698217 2.02091 0.526547 2.52656 0.526581H15.9179C16.4235 0.526547 16.9142 0.698217 17.3095 1.01348C17.7049 1.32873 17.9814 1.7689 18.094 2.26187L9.22221 7.68423L0.350475 2.26187ZM0.294678 3.53628V11.4639L6.77049 7.49341L0.294678 3.53628ZM7.83956 8.14847L0.507823 12.6424C0.68897 13.0243 0.974874 13.347 1.33226 13.5728C1.68965 13.7986 2.10381 13.9183 2.52656 13.9179H15.9179C16.3405 13.918 16.7546 13.798 17.1117 13.572C17.4689 13.346 17.7546 13.0233 17.9355 12.6412L10.6038 8.14735L9.22221 8.99212L7.83956 8.14735V8.14847ZM11.6739 7.49452L18.1497 11.4639V3.53628L11.6739 7.49341V7.49452Z"
                      fill="#FC6B00"
                    />
                  </svg>
                </div>
                <div className="flex-1 text-right">
                  <span className="text-lg font-semibold text-black block">
                    support@cravvelo.com
                  </span>
                  <span className="text-sm text-gray-600">
                    البريد الإلكتروني
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="w-full h-[80px] rounded-xl bg-[#E8EEAA] flex items-center justify-between gap-x-4 px-6 shadow-md hover:shadow-lg transition-shadow group">
                <div className="w-[50px] h-[50px] bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2.39875 1.16353C2.59402 0.968561 2.82848 0.817316 3.08662 0.719819C3.34475 0.622321 3.62066 0.580795 3.89606 0.597994C4.17145 0.615194 4.44005 0.690724 4.68405 0.819582C4.92805 0.948439 5.14188 1.12768 5.31136 1.34543L7.31448 3.91879C7.68162 4.39083 7.81107 5.00572 7.666 5.58601L7.05558 8.02992C7.02402 8.1565 7.02573 8.28909 7.06053 8.41482C7.09534 8.54055 7.16206 8.65514 7.25422 8.74747L9.99609 11.4893C10.0885 11.5817 10.2033 11.6485 10.3293 11.6833C10.4552 11.7181 10.588 11.7197 10.7148 11.688L13.1576 11.0776C13.4439 11.006 13.7428 11.0004 14.0316 11.0613C14.3205 11.1222 14.5917 11.248 14.8248 11.4291L17.3981 13.4311C18.3232 14.1509 18.4081 15.5179 17.58 16.3448L16.4261 17.4987C15.6003 18.3245 14.3661 18.6872 13.2156 18.2821C10.2708 17.246 7.59712 15.5601 5.39283 13.3496C3.18247 11.1456 1.49664 8.47234 0.460363 5.52798C0.0563917 4.37856 0.419073 3.14321 1.24487 2.31741L2.39875 1.16353Z"
                      fill="#FC6B00"
                    />
                  </svg>
                </div>
                <div className="flex-1 text-right">
                  <span className="text-lg font-semibold text-black block">
                    0795005940 / +971586272193
                  </span>
                  <span className="text-sm text-gray-600">رقم الهاتف</span>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="w-full max-w-[400px] text-center lg:text-right">
              <p className="text-gray-600 text-base leading-relaxed">
                نحن هنا لمساعدتك. تواصل معنا في أي وقت وسنكون سعداء للرد على
                استفساراتك
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="w-full h-full col-span-1 flex items-start justify-center lg:justify-start px-4 lg:px-8 pt-[60px] lg:pt-[80px]">
            <div className="w-full max-w-[500px]">
              <ContactUsForm />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* <HeroLights /> */}

      <Footer />
    </>
  );
};

export default Page;
