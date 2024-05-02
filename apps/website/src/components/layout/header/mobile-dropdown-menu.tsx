import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

import type { FC } from "react";
import React from "react";

interface MobileDropdownMenuProps {}

const DROP_DOWN_MENU_ITEMS = [
  {
    name: "الدورات التدريبية",
    href: "",
  },
  {
    name: "نظام الواجبات",
    href: "",
  },
  {
    name: "نظام الشهادات",
    href: "",
  },
  {
    name: "المنتجات الرقمية",
    href: "",
  },
  {
    name: "نظام الاختبارات",
    href: "",
  },
  {
    name: "كوبونات الخصم",
    href: "",
  },
];

const NestedMobileDropdownMenu: FC = ({}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  return (
    <div
      className={` ${
        isOpen ? "h-fit" : "h-[40px]"
      } w-full h-fit transition-all duration-200  `}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[40px] flex justify-between items-center font-semibold text-gray-600"
      >
        الخدمات
        <ChevronDown
          className={`${
            isOpen ? "rotate-180" : "rotate-0"
          } text-gray-600 w-4 h-4 transition-all duration-200 `}
        />
      </button>
      <div
        className={`w-full  ${
          isOpen ? "h-[260px] " : "h-[0]"
        } transition-all duration-200  pr-8 `}
      >
        {DROP_DOWN_MENU_ITEMS.map((item) => (
          <button
            key={item.name}
            className={` ${
              isOpen ? "flex" : "hidden"
            } w-full h-[40px] my-1 justify-between items-center text-gray-600`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
    // <DropdownMenu>
    //   <DropdownMenuTrigger className="flex items-center w-full font-semibold text-gray-600">
    //     الخدمات
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent className="w-full h-[400px] z-[999]">
    //     {DROP_DOWN_MENU_ITEMS.map((item) => (
    //       <DropdownMenuLabel key={item.name}>{item.name}</DropdownMenuLabel>
    //     ))}
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
};

export default NestedMobileDropdownMenu;
