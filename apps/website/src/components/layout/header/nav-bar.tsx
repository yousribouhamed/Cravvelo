"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button, buttonVariants } from "@ui/components/button";
import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import Image from "next/image";
import DropDownMenu from "../../drop-down-menu";
import MobileNav from "./mobile-nav";

const links = [
  { name: "الرئيسية", href: "/" },
  { name: "الخدمات", href: "/features" },
  // { name: "معلومات عنا", href: "/about-us" },
  { name: "تواصل معنا", href: "/contact-us" },
];

const NavBar = () => {
  const [hasShadow, setHasShadow] = useState(false);
  const [close, setClose] = useState(false);
  const path = usePathname();

  const handleScroll = useCallback(() => {
    setHasShadow(window.scrollY > 64);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  //bg-gradient-to-r from-[#ffeb38] to-[#fab508]
  return (
    <>
      <div className={`w-full h-[120px] z-[99] fixed top-0`}>
        {!close && (
          <div className="w-full h-[41px] bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex justify-center items-center gap-x-2 px-4 md:gap-x-20">
            <p className="text-white text-xs md:text-base font-bold ">
              تابعو صفحة cravvelo على instagram{" "}
              <Link
                href={"https://www.instagram.com/cravvelo/"}
                target="_blank"
              >
                من هنا
              </Link>
            </p>
            <Button
              onClick={() => setClose(true)}
              size="icon"
              className="bg-transparent hover:bg-transparent hover:scale-110 transition-all duration-75"
            >
              <X className="w-4 h-4 text-white" />
            </Button>
          </div>
        )}
        <div
          className={cn(
            "mx-auto w-full px-2.5 md:px-20 transition-all duration-150 relative",
            {
              "shadow-lg border-b bg-white": hasShadow,
            }
          )}
        >
          <div className="flex items-center mx-auto lg:max-w-screen-2xl 2xl:px-20 px-2.5 justify-between w-full h-[80px]">
            <div className="w-[20%] hidden md:flex items-center">
              <Link href="/">
                <Image
                  src="/Cravvelo_Logo-01.svg"
                  alt="logo"
                  width={160}
                  height={60}
                />
              </Link>
            </div>
            <div className="w-[33%] md:hidden flex items-center">
              <Link href="/">
                <Image
                  src="/Cravvelo_Logo-01.svg"
                  alt="logo"
                  width={260}
                  height={160}
                />
              </Link>
            </div>
            <nav className="w-[60%] hidden xl:flex items-center justify-center">
              <ul className="flex w-[22rem] flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium text-gray-500 sm:w-auto sm:flex-nowrap sm:gap-5">
                {links.map((item, index) =>
                  index === 1 ? (
                    <DropDownMenu key={index} />
                  ) : (
                    <Link
                      href={item.href}
                      key={item.name}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "font-semibold text-lg  text-black leading-[40px] rounded-full transition-all duration-150",
                        {
                          "border-[#FFB700] border-2 font-bold bg-[#FFEEC5]":
                            item.href === path,
                        }
                      )}
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </ul>
            </nav>
            <div className="w-[40%] hidden xl:flex items-center justify-end gap-x-4">
              <Link
                target="_blank"
                href="https://beta.cravvelo.com/sign-up"
                className={cn(
                  buttonVariants(),
                  "bg-primary border border-primary text-white xl:text-xl text-md py-4 h-12 rounded-2xl font-bold transition-all duration-150"
                )}
              >
                انشاء حساب
              </Link>
              <Link
                target="_blank"
                href="https://beta.cravvelo.com/sign-in"
                className={cn(
                  buttonVariants(),
                  "bg-white border border-primary text-primary xl:text-xl text-md py-4 h-12 rounded-2xl hover:text-white font-bold hover:bg-[#FC6B00] transition-all duration-150"
                )}
              >
                تسجيل الدخول
              </Link>
            </div>
            <div className="w-fit xl:hidden flex items-center pl-4">
              <MobileNav isTopAdOpen={!close} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
