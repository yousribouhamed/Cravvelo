"use client";

import { cn } from "@ui/lib/utils";
import SideBarMenu from "./mobile-menu";
import Logo from "../logo";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          "pb-12  bg-[#FC6B00] h-full rounded-lg  mt-4 hidden   ",
          className
        )}
      >
        <div className="space-y-4 py-2   ">
          <div className="px-3 pb-2 pt-6">
            <div className="w-full  h-[50px] relative ">
              <Logo />
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
