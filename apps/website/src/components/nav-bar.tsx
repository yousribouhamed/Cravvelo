import type { FC } from "react";
import MaxWidthWrapper from "./max-width-wrapper";
import { Button } from "@ui/components/button";
interface HeaderAbdullahProps {}

const links = [
  {
    name: "الرئيسية",
    slug: "/",
  },
  {
    name: "الخدمات",
    slug: "/",
  },
  {
    name: "الاسعار",
    slug: "/",
  },
  {
    name: "جدارة +",
    slug: "/",
  },
];

export const NavBar: FC = ({}) => {
  return (
    <div className="w-full h-[120px] ">
      <div className="mx-auto w-full   lg:max-w-screen-2xl  px-2.5 md:px-20">
        <div className=" flex items-center  bg-[#F8FAE5] justify-between rounded-xl abdullah-shadow gap-x-2 w-full h-[70px] lg:h-[100px] px-4 mt-8 ">
          {/* this section is for the logo */}
          <div className="w-[40%] h-full flex items-center justify-start ">
            <span className="text-3xl text-[#43766C] font-bold ">جدارة </span>
          </div>

          {/* this section is for the nav menu and the action button */}

          <div className="w-[60%] h-full flex items-end ">
            <div className="w-[70%] h-full flex items-center justify-start ">
              {links.map((item) => {
                return (
                  <Button
                    key={item.name}
                    variant="link"
                    className="font-bold text-xl leading-[40px]"
                  >
                    {item.name}
                  </Button>
                );
              })}
            </div>
            <div className="w-[30%] h-full flex items-center justify-end">
              <Button
                size="lg"
                className="bg-[#43766C] text-xl py-3 px-4 text-white font-bold "
              >
                انشاء حساب
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
