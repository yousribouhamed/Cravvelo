import { Button } from "@ui/components/ui/button";
import type { FC } from "react";

const SettingsSidebarView: FC = ({}) => {
  return (
    <div className="w-72 h-full border shadow rounded-2xl  bg-white flex flex-col gap-y-2  ">
      <div className="w-full h-[70px] bg-gray-200 rounded-t-2xl p-2 "></div>
      <div className="w-full h-fit p-4 flex flex-col gap-y-1">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start gap-x-2"
        >
          profile
        </Button>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start gap-x-2"
        >
          general
        </Button>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start gap-x-2"
        >
          appearance
        </Button>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start gap-x-2"
        >
          authorazation
        </Button>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start gap-x-2"
        >
          domains
        </Button>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start gap-x-2"
        >
          policy
        </Button>
      </div>
    </div>
  );
};

export default SettingsSidebarView;
