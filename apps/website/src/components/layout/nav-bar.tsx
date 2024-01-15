"use client";

import React, { type FC } from "react";
import { Button, buttonVariants } from "@ui/components/button";
import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { MobilNavBar } from "./mobil-nav-bar";
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

//abdullah-shadow  bg-white

export const NavBar: FC = ({}) => {
  const [hasShadow, setHasShadow] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled beyond a certain threshold (e.g., 20 pixels)
      const scrolled = window.scrollY > 64;

      // Update the state based on the scroll position
      setHasShadow(scrolled);
    };

    // Attach the scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Detach the scroll event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // The empty dependency array ensures that the effect runs only once, when the component mounts

  return (
    <div className="w-full h-[120px] z-[10] fixed top-4 ">
      <div
        className={cn(
          "mx-auto w-full lg:max-w-screen-2xl     px-2.5 md:px-20",
          {
            "shadow-2xl rounded-xl bg-[#FDF8F1] ": hasShadow,
          }
        )}
      >
        <div className=" flex items-center mx-auto   justify-between rounded-xl gap-x-2 w-full h-[90px] lg:h-[110px] px-4 ">
          {/* this section is for the logo */}
          <div className="w-[20%] h-full flex items-center justify-start ">
            <span className="text-3xl qatar-bold text-[#43766C] font-bold ">
              جدارة{" "}
            </span>
          </div>

          {/* this section is for the nav menu and the action button */}

          <div className="w-[70%] hidden h-full lg:flex items-center justify-center ">
            {links.map((item) => {
              return (
                <Link
                  href={"/"}
                  key={item.name}
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "font-bold text-2xl leading-[40px]"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="w-[20%] hidden h-full lg:flex items-center justify-end">
            <Link
              href={"https://jadara-dashboard.vercel.app/sign-up"}
              className={cn(
                buttonVariants(),
                "bg-[#43766C]  text-xl py-6  h-14 rounded-[17px]  text-white qatar-bold  hover:bg-[#61AFA0]"
              )}
            >
              انشاء حساب
            </Link>
          </div>
          <div className=" w-fit lg:hidden h-full flex items-center justify-end pl-4">
            <MobilNavBar />
          </div>
        </div>
      </div>
    </div>
  );
};
