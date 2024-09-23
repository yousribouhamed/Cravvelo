"use client";

import { SETTING_SADEBAR_EN } from "@cravvelo/i18n";
import { Button } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import type { FC } from "react";

const SettingsSidebarView: FC = ({}) => {
  const SETTING_SADEBAR = SETTING_SADEBAR_EN;

  // get the current page

  const router = useRouter();
  const path = usePathname();

  const isCurretRoute = (url: string) => url === path;

  return (
    <div className="w-60 h-full border shadow rounded-2xl  bg-white flex flex-col gap-y-2  ">
      <div className="w-full h-[70px]  rounded-t-2xl p-2 flex items-center gap-x-2 ">
        <div className="w-[40px] h-[40px] rounded-2xl bg-primary "></div>

        <div className="flex flex-col gap-y-2 w-[80%]">
          <span>Abdellah Chehri</span>
          <span className="truncate">mahdi.chahri55@gmail.com</span>
        </div>
      </div>
      <div className="w-full h-fit p-4 flex flex-col gap-y-1">
        {SETTING_SADEBAR?.map((item) => {
          return (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full flex items-center text-gray-600 justify-start gap-x-2",
                {
                  "text-black bg-gray-100": isCurretRoute(item.url),
                }
              )}
              size="sm"
              onClick={() => router.push(item.url)}
            >
              {<item.icon className="w-4 h-4 " />}
              {item.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsSidebarView;
