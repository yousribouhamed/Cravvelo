"use client";

import { Icons } from "@/src/components/Icons";
import { Button } from "@ui/components/ui/button";
import type { FC } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@ui/lib/utils";
import { Plug } from "lucide-react";

const ViewSwitcher: FC = ({}) => {
  const router = useRouter();
  const path = usePathname();
  return (
    <div className="w-[4rem] h-full absolute top-0 bottom-0 right-0 bg-black flex flex-col gap-y-4 items-center p-2">
      <Button
        variant="ghost"
        className={cn(
          `${path === "/editor" ? "bg-green-500 " : ""}`,
          "rounded-2xl w-[3rem] h-[3rem]"
        )}
      >
        <Icons.customize className="w-8 h-8 text-white" />
      </Button>
      <Button
        variant="ghost"
        className={cn(
          `${path === "/editor/settings" ? "bg-green-500 " : ""}`,
          "rounded-2xl w-[3rem] h-[3rem]"
        )}
      >
        <Icons.customize className="w-8 h-8 text-white" />
      </Button>
      <Button
        variant="ghost"
        className={cn(
          `${path === "/editor/plugins" ? "bg-green-500 " : ""}`,
          "rounded-2xl w-[3rem] h-[3rem]"
        )}
      >
        <Plug className="w-8 h-8 text-white" />
      </Button>
    </div>
  );
};

export default ViewSwitcher;
