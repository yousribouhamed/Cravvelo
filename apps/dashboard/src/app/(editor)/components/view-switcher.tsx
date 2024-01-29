"use client";

import { Icons } from "@/src/components/Icons";
import { Button } from "@ui/components/ui/button";
import type { FC } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@ui/lib/utils";
import { Plug } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";
import { FolderClosed } from "lucide-react";

const ViewSwitcher: FC = ({}) => {
  const router = useRouter();
  const path = usePathname();
  return (
    <TooltipProvider>
      <div className="w-[4rem] h-full absolute top-0 bottom-0 right-0 bg-black flex flex-col gap-y-4 items-center p-2">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => router.push("/editor")}
              className={cn(
                `${path === "/editor" ? "bg-orange-500 " : ""}`,
                "rounded-2xl w-[3rem] h-[3rem] transition-all hover:bg-transparent duration-300 "
              )}
            >
              <Icons.customize className="w-8 h-8 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>العودة إلى لوحة القيادة</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => router.push("/editor/assets")}
              className={cn(
                `${path === "/editor/assets" ? "bg-orange-500 " : ""}`,
                "rounded-2xl w-[3rem] h-[3rem] transition-all duration-300 hover:bg-transparent"
              )}
            >
              <FolderClosed className="w-8 h-8 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>العودة إلى لوحة القيادة</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => router.push("/editor/plugins")}
              className={cn(
                `${path === "/editor/plugins" ? "bg-orange-500 " : ""}`,
                "rounded-2xl w-[3rem] h-[3rem] transition-all duration-300 hover:bg-transparent "
              )}
            >
              <Plug className="w-8 h-8 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>العودة إلى لوحة القيادة</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ViewSwitcher;
