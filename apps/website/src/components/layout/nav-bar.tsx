"use client";

import React, { type FC } from "react";
import { Button, buttonVariants } from "@ui/components/button";
import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { MobilNavBar } from "./mobil-nav-bar";
import { useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";
interface HeaderAbdullahProps {}

const links = [
  {
    name: "الرئيسية",
    slug: "/",
  },
  {
    name: "المنتج",
    slug: "/product",
  },
  {
    name: "المصادر",
    slug: "/resources",
  },
  {
    name: "الخدمات",
    slug: "/services",
  },
  {
    name: "الاسعار",
    slug: "/pricing",
  },
  {
    name: "جدارة +",
    slug: "/jadara+",
  },
];

//abdullah-shadow  bg-white

export const NavBar: FC = ({}) => {
  const [hasShadow, setHasShadow] = React.useState(false);
  const [close, setClose] = React.useState(false);
  const path = usePathname();

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
    <>
      <div
        className={`w-full h-[120px] z-[99] fixed top-0 
         
         `}
      >
        {!close && (
          <div className="w-full h-[41px] bg-gradient-to-r  from-[#ffeb38] to-[#fab508] flex justify-center gap-x-20   items-center">
            <p className="text-black font-bold text-center text-base">
              ابدأ رحلتك اليوم وقم ببناء أكاديميتك
            </p>
            <Button
              onClick={() => setClose(true)}
              size="icon"
              className="bg-transparent hover:bg-transparent hover:scale-110 transition-all duration-75"
            >
              <X className="w-4 h-4 text-black" />
            </Button>
          </div>
        )}
        <div
          //
          className={cn(
            "mx-auto w-full    px-2.5 md:px-20 transition-all duration-150 ",
            {
              "shadow-lg border-b bg-white ": hasShadow,
            }
          )}
        >
          <div className=" flex items-center mx-auto lg:max-w-screen-2xl 2xl:px-20 px-2.5  justify-between rounded-xl gap-x-2 w-full h-[80px]  ">
            {/* this section is for the logo */}
            <div className="w-[10%] h-full flex items-center justify-start ">
              <span className="text-2xl qatar-bold text-black font-bold ">
                جدارة{" "}
              </span>
            </div>

            {/* this section is for the nav menu and the action button */}

            <div className="w-[80%] hidden h-full lg:flex items-center justify-center ">
              {links.map((item) => {
                return (
                  <Link
                    href={"/"}
                    key={item.name}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "font-bold text-lg leading-[40px] rounded-full transition-all duration-150  ",
                      {
                        "border-[#FFB700] border-2  bg-[#FFEEC5]":
                          item.slug === path,
                      }
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="w-[20%] hidden h-full lg:flex items-center justify-end">
              <Link
                href={"https://jadir.vercel.app/sign-in"}
                className={cn(
                  buttonVariants(),
                  "bg-[#FC6B00]  text-xl py-4  h-12 rounded-2xl text-white font-bold  hover:bg-[#61AFA0] hover:scale-105 transition-all duration-150 "
                )}
              >
                تسجيل الدخول
              </Link>
            </div>
            <div className=" w-fit lg:hidden h-full flex items-center justify-end pl-4">
              <MobilNavBar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
