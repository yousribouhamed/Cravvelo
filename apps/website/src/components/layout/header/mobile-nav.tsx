"use client";

import { Button } from "@ui/components/ui/button";
import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
    href: "/",
  },
  {
    name: "تواصل معنا",
    href: "/",
  },
];

const MobileNav = () => {
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
    <div className="sm:hidden">
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
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 top-[120px] z-0 w-full border-t shadow-xl">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-10 pb-8">
            <>
              {links.map((item) => {
                return (
                  <li key={item.name}>
                    <Link
                      onClick={() => closeOnCurrent("/")}
                      className="flex items-center w-full font-semibold text-gray-600"
                      href="/sign-up"
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}

              <Button
                variant="outline"
                className="w-full h-[40px] flex items-center justify-center mt-4 "
              >
                تسجيل الدخول
              </Button>
              <Button className="w-full h-[40px] flex items-center justify-center ">
                انشاء حساب
              </Button>
            </>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNav;
