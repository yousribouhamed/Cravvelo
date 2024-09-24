"use client";

import { SETTING_SADEBAR_EN, SETTING_SADEBAR_AR } from "@cravvelo/i18n";
import { Button } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import type { FC } from "react";

interface Props {
  lang: string;
  force_display?: boolean;
}

const SettingsSidebarView: FC<Props> = ({ lang, force_display = false }) => {
  const SETTING_SADEBAR =
    lang === "en" ? SETTING_SADEBAR_EN : SETTING_SADEBAR_AR;

  const router = useRouter();
  const path = usePathname();

  const isCurretRoute = (url: string) => url === path;

  return (
    <div
      className={` w-60 h-full border   shadow rounded-2xl  bg-white  flex-col gap-y-2  ${
        force_display ? "flex" : "hidden md:flex"
      } `}
    >
      <div
        className={` w-full h-[70px]  rounded-t-2xl p-2 flex items-center gap-x-2  `}
      >
        {lang === "en" ? (
          <>
            <div className="w-[40px] h-[40px] rounded-2xl bg-primary "></div>

            <div className="flex flex-col gap-y-2 w-[80%]">
              <span>Abdellah Chehri</span>
              <span className="truncate">mahdi.chahri55@gmail.com</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-y-2 w-[80%]">
              <span>Abdellah Chehri</span>
              <span className="truncate">mahdi.chahri55@gmail.com</span>
            </div>
            <div className="w-[40px] h-[40px] rounded-2xl bg-primary "></div>
          </>
        )}
      </div>
      <div className="w-full h-fit p-4 flex flex-col gap-y-1">
        {SETTING_SADEBAR?.map((item) => {
          return (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full flex items-center text-[#303030] justify-start gap-x-2",
                {
                  "text-black bg-gray-100": isCurretRoute(item.url),
                  "justify-start": lang === "en",
                  "justify-end": lang === "ar",
                }
              )}
              size="sm"
              onClick={() => router.push(item.url)}
            >
              {lang === "en" ? (
                <>
                  {<item.icon className="w-4 h-4 " />}
                  {item.name}
                </>
              ) : (
                <>
                  {item.name}
                  {<item.icon className="w-4 h-4 " />}
                </>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsSidebarView;
