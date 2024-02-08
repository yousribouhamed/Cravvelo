import type { FC } from "react";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";

const COLORS_SCHEMA = [
  {
    color: "#64748b",
    lable: "Slate",
  },
  {
    color: "#6b7280",
    lable: "Gray",
  },
  {
    color: "#71717a",
    lable: "Zinc",
  },
  {
    color: "#737373",
    lable: "Neutral",
  },
  {
    color: "#78716c",
    lable: "Stone",
  },
  {
    color: "#ef4444",
    lable: "Red",
  },
  {
    color: "#f97316",
    lable: "Orange",
  },
  {
    color: "#f59e0b",
    lable: "Amber",
  },
  {
    color: "#eab308",
    lable: "Yellow",
  },

  {
    color: "#84cc16",
    lable: "Lime",
  },
  {
    color: "#22c55e",
    lable: "Green",
  },
  {
    color: "#10b981",
    lable: "Emerald",
  },
  {
    color: "#14b8a6",
    lable: "Teal",
  },

  {
    color: "#06b6d4",
    lable: "Cyan",
  },
  {
    color: "#0ea5e9",
    lable: "Sky",
  },
  {
    color: "#3b82f6",
    lable: "Blue",
  },
  {
    color: "#6366f1",
    lable: "Indigo",
  },

  {
    color: "#8b5cf6",
    lable: "Violet",
  },
  {
    color: "#a855f7",
    lable: "Purple",
  },
  {
    color: "#d946ef",
    lable: "Fuchsia",
  },
  {
    color: "#ec4899",
    lable: "Pink",
  },

  {
    color: "#f43f5e",
    lable: "Rose",
  },
];

const SystemDesignConfig: FC = ({}) => {
  const handleOnDrag = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("componetType", type);
  };

  return (
    <TooltipProvider>
      <ScrollArea className="w-full h-fit ">
        <div
          dir="rtl"
          className="w-[290px] h-fit min-h-[200px] flex flex-wrap items-center p-4  gap-2"
        >
          <div className="w-full h-[40px] flex items-center justify-start">
            <p className="text-sm font-semibold text-black">لوحات الألوان </p>
          </div>
          {COLORS_SCHEMA.map((item) => (
            <Tooltip key={item.color} delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  style={{
                    background: item.color,
                  }}
                  className="w-[30px] h-[30px] rounded-md  hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow "
                ></div>
              </TooltipTrigger>
              <TooltipContent className="text-black bg-white shadow">
                <p>{item.lable}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div
          dir="rtl"
          className="w-[290px] h-fit min-h-[200px] flex flex-wrap items-center p-4  gap-2"
        >
          <div className="w-full h-[40px] flex items-center justify-start">
            <p className="text-sm font-semibold text-black"> منسق الخطوط </p>
          </div>
          <div className="w-full h-[100px] bg-primary flex items-center justify-center">
            <p className="text-white font-bold">this will be added alter</p>
          </div>
        </div>
      </ScrollArea>
    </TooltipProvider>
  );
};

export default SystemDesignConfig;
