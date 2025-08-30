import { Button } from "@ui/components/ui/button";
import { X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface TopBannerProps {
  close: boolean;
  setClose: Dispatch<SetStateAction<boolean>>;
}

export default function TopBanner({ setClose }: TopBannerProps) {
  return (
    <div className="w-full h-[41px] bg-gradient-to-r bg-[#1c53d3]  flex justify-center items-center gap-x-2 px-4 md:gap-x-20">
      <p className="text-white text-xs md:text-base font-bold ">
        انضم إلى قائمة الانتظار وكن من أول المستخدمين لـ Cravvelo
      </p>
      <Button
        onClick={() => setClose(true)}
        size="icon"
        className="bg-transparent hover:bg-transparent hover:scale-110 transition-all duration-75"
      >
        <X className="w-4 h-4 text-white" />
      </Button>
    </div>
  );
}
