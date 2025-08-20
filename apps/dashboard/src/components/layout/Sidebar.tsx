"use client";

import { cn } from "@ui/lib/utils";
import SideBarMenu from "./menu";
import AddNew from "../models/add-new-modal";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          "pb-12   bg-[#FC6B00] dark:bg-card m-2 rounded-2xl    h-[97%]    hidden   ",
          className
        )}
      >
        <div className="space-y-4 py-2   ">
          <div className="px-3 pb-2 pt-6">
            <div className="w-full  h-[50px] relative ">
              <AddNew />
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
