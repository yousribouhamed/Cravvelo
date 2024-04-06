"use client";

import React, { type FC } from "react";
import { Button, buttonVariants } from "@ui/components/button";
import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { MobilNavBar } from "./mobil-nav-bar";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import Image from "next/image";
import DropDownMenu from "../../drop-down-menu";

const links = [
  {
    name: "الرئيسية",
    href: "/",
  },

  {
    name: "الخدمات",
    href: "/features",
  },
  {
    name: "معلومات عنا",
    href: "/about-us",
  },
  {
    name: "تواصل معنا",
    href: "/contact-us",
  },
];

//abdullah-shadow  bg-white

export const NavBar: FC = ({}) => {
  const [hasShadow, setHasShadow] = React.useState(false);
  const [close, setClose] = React.useState(false);
  const path = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 64;
      setHasShadow(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
            "mx-auto w-full    px-2.5 md:px-20 transition-all duration-150 relative -z-[9]",
            {
              "shadow-lg border-b bg-white ": hasShadow,
            }
          )}
        >
          <div className=" flex items-center mx-auto lg:max-w-screen-2xl 2xl:px-20 px-2.5  justify-between rounded-xl gap-x-2 w-full h-[80px]  ">
            {/* this section is for the logo */}
            <div className="w-[20%] h-full flex items-center justify-start ">
              <Link href={"/"}>
                <Image
                  src="/Cravvelo_Logo-01.svg"
                  alt="logo"
                  width={160}
                  height={60}
                />
              </Link>
            </div>

            {/* this section is for the nav menu and the action button */}

            <nav className="w-[60%] hidden h-full lg:flex items-center justify-center ">
              <ul className="flex w-[22rem] flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium text-gray-500 sm:w-[initial] sm:flex-nowrap sm:gap-5">
                {links.map((item, index) => {
                  if (index === 1) {
                    return <DropDownMenu key={index + "something"} />;
                  }
                  return (
                    <Link
                      href={item.href}
                      key={item.name}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "font-semibold text-lg text-black leading-[40px]  rounded-full transition-all duration-150  ",
                        {
                          "border-[#FFB700] border-2  font-bold bg-[#FFEEC5]":
                            item.href === path,
                        }
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </ul>
            </nav>
            <div className="w-[40%] hidden h-full lg:flex items-center justify-end gap-x-4">
              <Link
                href={"https://app.cravvelo.com/sign-up"}
                className={cn(
                  buttonVariants(),
                  "bg-primary border border-primary text-white text-xl py-4  h-12 rounded-2xl  font-bold     transition-all duration-150 "
                )}
              >
                انشاء حساب
              </Link>
              <Link
                href={"https://app.cravvelo.com/sign-in"}
                className={cn(
                  buttonVariants(),
                  "bg-white border border-primary text-primary text-xl py-4  h-12 rounded-2xl hover:text-white font-bold  hover:bg-[#FC6B00]   transition-all duration-150 "
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
