"use client";

import type { FC } from "react";
import { useTimer } from "react-timer-hook";

const LiarSales: FC = ({}) => {
  const expiryTimestamp = new Date();

  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 600 * 24);

  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  return (
    <div className="w-full bg-[#f02d00] h-[40px] flex items-center justify-center gap-x-2 sm:gap-x-8 px-8">
      <div className="w-fit h-full flex items-center justify-start">
        <span className="font-bold text-white text-xs sm:text-lg">
          تخفيضات على جميع الدورات في الأكاديمية
        </span>
      </div>
      <div
        dir="ltr"
        className="w-[100px] flex items-center justify-start text-white gap-x-[2px]"
      >
        <span className=" text-xs sm:text-lg font-bold">{days}</span>:
        <span className=" text-xs sm:text-lg font-bold">{hours}</span>:
        <span className=" text-xs sm:text-lg font-bold">{minutes}</span>:
        <span className=" text-xs sm:text-lg font-bold">{seconds}</span>
      </div>
    </div>
  );
};

export default LiarSales;
