"use client";

import { SETTING_SADEBAR_EN } from "@cravvelo/i18n";
import { Button } from "@ui/components/ui/button";
import type { FC } from "react";

const SettingsSidebarView: FC = ({}) => {
  const SETTING_SADEBAR = SETTING_SADEBAR_EN;

  return (
    <div className="w-60 h-full border shadow rounded-2xl  bg-white flex flex-col gap-y-2  ">
      <div className="w-full h-[70px] bg-gray-200 rounded-t-2xl p-2 flex items-center gap-x-2 ">
        <div className="w-[50px] h-[50px] rounded-xl bg-primary "></div>

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
              className="w-full flex items-center justify-start gap-x-2"
              size="sm"
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
