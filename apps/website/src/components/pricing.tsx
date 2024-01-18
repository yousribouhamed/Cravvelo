import type { FC } from "react";
import { PLANS } from "../constants/pricing";

interface PricingAbdullahProps {}

const Pricing: FC = ({}) => {
  return (
    <div className="w-full h-[1000px] ">
      <div className="w-full h-[200px] "></div>
      <div className="w-full max-w-6xl mx-auto h-[800px] grid grid-cols-3 gap-10 ">
        {PLANS.map((item) => {
          return (
            <div className="w-full h-full bg-white shadow-2xl border rounded-2xl py-2 px-4 flex flex-col ">
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;
