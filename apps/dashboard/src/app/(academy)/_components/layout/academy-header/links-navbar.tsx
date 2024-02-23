"use client";

import { cn } from "@ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function LinksNavbar() {
  const path = usePathname();

  const isCurrentPath = ({ currentPath }: { currentPath: string }) =>
    path === currentPath || currentPath === "/";
  return (
    <div className="min-w-[100px] h-full w-fit flex items-center gap-x-6 justify-start px-6">
      <Link href={"/"}>
        <button
          className={cn(
            " rounded-xl text-md p-2 bg-transparent hover:bg-gray-50  ",
            {
              "text-black font-bold  ": isCurrentPath({
                currentPath: "/",
              }),
            }
          )}
        >
          الرئيسية
        </button>
      </Link>
      <Link href={"/course-academy"} className="text-lg ">
        <button
          className={cn(
            " rounded-xl text-md p-2 bg-transparent hover:bg-gray-50  ",
            {
              "text-black font-bold ": isCurrentPath({
                currentPath: "/course-academy",
              }),
            }
          )}
        >
          الدورات التدريبية
        </button>
      </Link>
      <Link href={"/products-academy"} className="text-lg ">
        <button
          className={cn(
            " rounded-xl text-md p-2 bg-transparent hover:bg-gray-50  ",
            {
              "text-black font-bold bg-gray-100  hover:bg-gray-100 ":
                isCurrentPath({
                  currentPath: "/products-academy",
                }),
            }
          )}
        >
          المنتجات الرقمية
        </button>
      </Link>
    </div>
  );
}

export default LinksNavbar;
