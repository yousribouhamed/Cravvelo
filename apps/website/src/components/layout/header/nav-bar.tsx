"use client";

import React, { useEffect, useState, useCallback } from "react";
import { buttonVariants } from "@ui/components/button";
import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import DropDownMenu from "../../drop-down-menu";
import MobileNav from "./mobile-nav";
import TopBanner from "../../top-banner";
import { WaitingListModal } from "../../waiting-list";

const links = [
  { name: "الرئيسية", href: "/" },
  { name: "الخدمات", href: "/features" },

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

  return (
    <>
      <div className={`w-full h-[120px] z-[1] fixed top-0`}>
        {!close && <TopBanner close={close} setClose={setClose} />}
        <div
          className={cn(
            "mx-auto w-full border-b bg-white px-2.5 sm:px-4 md:px-6 lg:px-8 xl:px-20 transition-all duration-150 relative"
            // {
            //   "shadow-lg ": hasShadow,
            // }
          )}
        >
          <div className="flex items-center mx-auto lg:max-w-screen-2xl 2xl:px-20 px-2.5 justify-between  w-full h-[80px]">
            {/* Logo Section - Responsive */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="block">
                <Image
                  src="/Cravvelo_Logo-01.svg"
                  alt="logo"
                  width={160}
                  height={60}
                  className="hidden sm:block w-auto h-[40px] sm:h-[50px] md:h-[60px]"
                />
                <Image
                  src="/Cravvelo_Logo-01.svg"
                  alt="logo"
                  width={140}
                  height={52}
                  className="block sm:hidden w-auto h-[36px]"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center justify-center flex-1 max-w-2xl mx-8">
              <ul className="flex items-center justify-center gap-2 lg:gap-3 xl:gap-5 text-[0.85rem] lg:text-[0.9rem] font-medium text-gray-500">
                {links.map((item, index) =>
                  index === 1 ? (
                    <DropDownMenu key={index} />
                  ) : (
                    <Link
                      href={item.href}
                      key={item.name}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "font-semibold text-base lg:text-lg text-black leading-[40px] rounded-full transition-all duration-150 px-3 lg:px-4 whitespace-nowrap",
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

            {/* Desktop Auth Buttons */}
            <div className="hidden xl:flex items-center justify-end gap-x-2 lg:gap-x-4 flex-shrink-0">
              <WaitingListModal />
            </div>

            {/* Mobile Navigation */}
            <div className="flex xl:hidden items-center">
              <MobileNav isTopAdOpen={!close} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
