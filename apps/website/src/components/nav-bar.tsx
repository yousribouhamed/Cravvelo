import type { FC } from "react";
import MaxWidthWrapper from "./max-width-wrapper";

interface HeaderAbdullahProps {}

export const NavBar: FC = ({}) => {
  return (
    <div className="w-full h-[120px] ">
      <div className="mx-auto w-full max-w-[2500px] px-2.5 md:px-20  h-fit">
        <div className="mt-8 h-[100px] shadow-lg  rounded-xl flex items-center justify-between">
          <div className="bg-green-200 w-[30%] h-[50px] ">
            <span className="text-xl text-white">logo</span>
          </div>

          <div className="w-[30%] h-full bg-red-500"></div>
          <div className="w-[30%] h-full bg-blue-500"></div>
        </div>
      </div>
    </div>
  );
};
