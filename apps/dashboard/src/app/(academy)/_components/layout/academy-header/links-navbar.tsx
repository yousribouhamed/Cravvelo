"use client";

import { cn } from "@ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function LinksNavbar() {
  const path = usePathname();

  const isCurrentPath = ({ currentPath }: { currentPath: string }) =>
    path === currentPath || (currentPath === "/" && path === "/");
  return (
    <div className="min-w-[100px] h-full w-fit flex items-center gap-x-6 justify-start px-6">
      <Link href={"/"}>
        <button
          className={cn("  h-[65px]  text-md  bg-transparent  ", {
            "text-black font-bold border-b-4 border-black  ": isCurrentPath({
              currentPath: "/",
            }),
          })}
        >
          الرئيسية
        </button>
      </Link>
      <Link href={"/course-academy"} className="text-lg ">
        <button
          className={cn("  h-[65px]  text-md  bg-transparent ", {
            "text-black font-bold border-b-4 border-black  ": isCurrentPath({
              currentPath: "/course-academy",
            }),
          })}
        >
          الدورات التدريبية
        </button>
      </Link>
    </div>
  );
}

export default LinksNavbar;
