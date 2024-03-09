"use client";

import { sidebar_item } from "@/data";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter();

  const path = usePathname();
  return (
    <>
      <div className={`pb-12  bg-orange-950 h-full    hidden   ${className} `}>
        <div className="space-y-4 py-4   ">
          <div className="w-full h-[50px] flex items-center justify-center">
            <h2 className="text-white font-bold text-3xl ">Cravvelo</h2>
          </div>
          <div className="px-3 pb-2 pt-6">
            {sidebar_item.map((item) => {
              return (
                <Link
                  className={` w-full h-[50px] flex items-center justify-start gap-x-4 rounded-xl p-4 ${
                    item.url === path ? " bg-white/10 " : ""
                  } `}
                  href={item.url}
                >
                  <item.icon />
                  <span className=" text-white "> {item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
