"use client";

import { cn } from "@ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Ripples from "react-ripples";

function LinksNavbar() {
  const path = usePathname();

  const isCurrentPath = ({ currentPath }: { currentPath: string }) =>
    path === currentPath || (currentPath === "/" && path === "/");
  return (
    <div className="min-w-[100px] h-full w-fit flex items-center gap-x-6 justify-start px-6">
      <Ripples>
        <Link href={"/"}>
          <button
            data-ripple-light="true"
            className={cn(
              "  h-[65px] text-gray-500 transition-all duration-300 hover:text-gray-800 text-md  bg-transparent  ",
              {
                "text-black font-bold border-b-4 border-black  ": isCurrentPath(
                  {
                    currentPath: "/",
                  }
                ),
              }
            )}
          >
            الرئيسية
          </button>
        </Link>
      </Ripples>
      <Ripples>
        <Link href={"/course-academy"} className="text-md ">
          <button
            data-ripple-light="true"
            className={cn(
              "  h-[65px] text-gray-500 transition-all duration-300 hover:text-gray-800 text-md  bg-transparent ",
              {
                "text-black font-bold border-b-4 border-black  ": isCurrentPath(
                  {
                    currentPath: "/course-academy",
                  }
                ),
              }
            )}
          >
            الدورات التدريبية
          </button>
        </Link>
      </Ripples>
      <Ripples>
        <Link href={"/product-academy"} className="text-md ">
          <button
            data-ripple-light="true"
            className={cn(
              "  h-[65px] text-gray-500 transition-all duration-300 hover:text-gray-800 text-md  bg-transparent ",
              {
                "text-black font-bold border-b-4 border-black  ": isCurrentPath(
                  {
                    currentPath: "/product-academy",
                  }
                ),
              }
            )}
          >
            المنتجات الرقمية
          </button>
        </Link>
      </Ripples>
    </div>
  );
}

export default LinksNavbar;
