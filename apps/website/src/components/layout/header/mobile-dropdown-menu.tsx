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
import { useTranslations } from "next-intl";

interface MobileDropdownMenuProps {}

const NestedMobileDropdownMenu: FC = ({}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const t = useTranslations("header.services");

  const DROP_DOWN_MENU_ITEMS = [
    {
      name: t("items.trainingCourses.title"),
      href: "",
    },
    {
      name: t("items.assignments.title"),
      href: "",
    },
    {
      name: t("items.certificates.title"),
      href: "",
    },
    {
      name: t("items.digitalProducts.title"),
      href: "",
    },
    {
      name: t("items.tests.title"),
      href: "",
    },
    {
      name: t("items.discountCoupons.title"),
      href: "",
    },
  ];

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
        {t("label")}
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
