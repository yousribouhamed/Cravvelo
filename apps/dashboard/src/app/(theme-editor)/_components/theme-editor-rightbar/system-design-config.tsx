import type { FC } from "react";
import { ScrollArea } from "@ui/components/ui/scroll-area";

const COLORS_SCHEMA = [1, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10];

const SystemDesignConfig: FC = ({}) => {
  const handleOnDrag = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("componetType", type);
  };

  return (
    <ScrollArea className="w-full h-fit ">
      <div
        dir="rtl"
        className="w-[290px] h-fit min-h-[200px] flex flex-wrap items-center p-4  gap-2"
      >
        <div className="w-full h-[40px] flex items-center justify-start">
          <p className="text-sm font-semibold text-zinc-500">لوحات الألوان </p>
        </div>
        {COLORS_SCHEMA.map((item) => (
          <div className="w-[30px] h-[30px] rounded-lg bg-pink-500 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow "></div>
        ))}
      </div>
      <div
        dir="rtl"
        className="w-[290px] h-fit min-h-[200px] flex flex-wrap items-center p-4  gap-2"
      >
        <div className="w-full h-[40px] flex items-center justify-start">
          <p className="text-sm font-semibold text-zinc-500"> منسق الخطوط </p>
        </div>
        {COLORS_SCHEMA.map((item) => (
          <div className="w-[30px] h-[30px] rounded-lg bg-pink-500 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow "></div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SystemDesignConfig;
