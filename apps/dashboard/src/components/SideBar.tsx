"use client";

import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/ui/button";
import { Icons } from "./Icons";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SideBarMenu from "./MobilMenu";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter();

  const path = usePathname();

  return (
    <div className={cn("pb-12 hidden md:block bg-[#294943] ", className)}>
      <div className="space-y-4 py-2">
        <div className="px-3 pb-2">
          <div className="w-full  h-[50px] relative ">
            <Button
              size="lg"
              className="text-[#294943] text-xl w-full font-bold bg-white "
            >
              إضافة جديد
            </Button>
          </div>
          <div className="space-y-2 mt-5">
            <SideBarMenu />
            {/* <Link href={"/admin"}>
              <Button
                variant={"ghost"}
                className={`w-full justify-start  ${
                  path === "/admin" ? "text-white" : "text-[#A9B9B6]"
                } `}
              >
                <Icons.Home className="w-5 h-5 ml-2 " />
                الرئيسية
              </Button>
            </Link>
            <Link href={"/admin/courses"}>
              <Button
                variant={"ghost"}
                className={`w-full justify-start  ${
                  path === "/admin/courses" ? "text-white" : "text-[#A9B9B6]"
                } `}
              >
                <Icons.academy className="w-5 h-5 ml-2 " />
                دورة تدريبية
              </Button>
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
