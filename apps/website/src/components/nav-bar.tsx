import type { FC } from "react";
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
    <div className="w-full h-[120px] z-[999] fixed top-4 ">
      <div className="mx-auto w-full   lg:max-w-screen-2xl  px-2.5 md:px-20">
        <div className=" flex items-center  bg-white justify-between rounded-xl abdullah-shadow gap-x-2 w-full h-[90px] lg:h-[110px] px-4 mt-8 ">
          {/* this section is for the logo */}
          <div className="w-[20%] h-full flex items-center justify-start ">
            <span className="text-3xl qatar-bold text-[#43766C] font-bold ">
              جدارة{" "}
            </span>
          </div>

          {/* this section is for the nav menu and the action button */}

          <div className="w-[70%] h-full flex items-center justify-center ">
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
          <div className="w-[20%] h-full flex items-center justify-end">
            <Button className="bg-[#43766C] hover:bg-[#61AFA0] qatar-bold text-lg flex justify-center items-center   hover:text-white rounded-lg h-12 px-[20px]  font-bold text-[#F8FAE5] ">
              انشاء حساب
            </Button>
          </div>
        </div>
        <div className="w-[50%] lg:hidden h-full flex items-center justify-end pl-4">
          menu
        </div>
      </div>
    </div>
  );
};
