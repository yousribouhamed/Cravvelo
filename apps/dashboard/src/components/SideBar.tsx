"use client";

import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/ui/button";
import { Icons } from "./Icons";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SideBarMenu from "./MobilMenu";
import Logo from "./Logo";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter();

  const path = usePathname();

  return (
    <>
      <div className={cn("pb-12 hidden md:block   ", className)}>
        <div className="w-full h-[100px]  flex items-center justify-center">
          <Logo />
        </div>
        <div className="space-y-4 py-2 bg-[#43766C] h-[90%] rounded-[17px]  ">
          <div className="px-3 pb-2">
            <div className="w-full  h-[50px] relative ">
              <Button
                size="lg"
                className="text-[#43766C] text-xl qatar-bold hover:bg-[#FFB800] hover:text-white rounded-[17px] h-14 w-full font-bold bg-white "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="31"
                  viewBox="0 0 49 50"
                  fill="none"
                >
                  <path
                    d="M12.296 34.996C6.77512 28.2559 7.76348 18.3164 14.5035 12.7956C21.2437 7.27465 31.1831 8.26307 36.704 15.0031C42.2249 21.7433 41.2365 31.6826 34.4964 37.2035C27.7563 42.7244 17.8169 41.7361 12.296 34.996Z"
                    fill="#43766C"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M24.5012 16.4445C25.4025 16.4445 26.1332 17.1752 26.1332 18.0765L26.1332 31.924C26.1332 32.8253 25.4025 33.5559 24.5012 33.5559C23.5999 33.5559 22.8693 32.8253 22.8693 31.924L22.8693 18.0765C22.8693 17.1752 23.5999 16.4445 24.5012 16.4445Z"
                    fill="#F8FAE5"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M33.0569 25.0002C33.0569 25.9015 32.3263 26.6322 31.425 26.6322H17.5775C16.6762 26.6322 15.9455 25.9015 15.9455 25.0002C15.9455 24.0989 16.6762 23.3683 17.5775 23.3683H31.425C32.3263 23.3683 33.0569 24.0989 33.0569 25.0002Z"
                    fill="#F8FAE5"
                  />
                </svg>
                إضافة جديد
              </Button>
            </div>
            <div className="space-y-2 mt-5">
              <SideBarMenu />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
