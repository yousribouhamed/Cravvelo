"use client";

import { Button, buttonVariants } from "@ui/components/ui/button";
import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NestedMobileDropdownMenu from "./mobile-dropdown-menu";
import { cn } from "@ui/lib/utils";

const links = [
  {
    name: "الرئيسية",
    href: "/",
  },

  {
    name: "الخدمات",
    href: "/",
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

interface MobileNavProps {
  isTopAdOpen: boolean;
}

const MobileNav = ({ isTopAdOpen = true }: MobileNavProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleOpen = () => setOpen((prev) => !prev);

  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) toggleOpen();
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

  return (
    <div className="xl:hidden h-fit">
      {/* <Menu
        onClick={toggleOpen}
        className="relative z-50 h-5 w-5 text-zinc-900 hover:bg-primary"
      />
       */}
      <Button
        onClick={toggleOpen}
        variant="secondary"
        size="icon"
        className="border-[#FFB700] border-2  bg-[#FFEEC5]"
      >
        <Menu className="text-black w-8 h-8" />
      </Button>

      {isOpen ? (
        <div
          className={`fixed h-fit animate-in slide-in-from-top-5 fade-in-20 inset-0 ${
            isTopAdOpen ? "top-[120px]" : "top-[70px]"
          }  z-0 w-full border-t shadow-xl`}
        >
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-10 pb-8">
            <>
              {links.map((item, index) => {
                console.log("this is the index");
                console.log(index);
                if (index === 1) {
                  return <NestedMobileDropdownMenu key={item?.name} />;
                }

                return (
                  <li key={item.name}>
                    <Link
                      onClick={() => closeOnCurrent(item.href)}
                      className="flex items-center w-full font-semibold text-gray-600"
                      href="/"
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}

              <Link
                target="_blank"
                href="https://beta.cravvelo.com/sign-in"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full h-[40px] flex items-center justify-center mt-4 "
                )}
              >
                تسجيل الدخول
              </Link>
              <Link
                target="_blank"
                href="https://beta.cravvelo.com/sign-up"
                className={cn(
                  buttonVariants(),
                  "w-full h-[40px] flex items-center justify-center "
                )}
              >
                انشاء حساب
              </Link>
            </>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNav;
