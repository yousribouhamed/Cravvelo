"use client";
import { ArrowRight } from "lucide-react";
import type { FC } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";
import { useTheme } from "next-themes";
import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";

import React from "react";
import { FilePlus } from "lucide-react";

import PublishWebsite from "@/src/components/models/editor/publish-website";
import { useRouter } from "next/navigation";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { WebSitePage } from "@/src/types";
import { Play } from "lucide-react";
import { Plus } from "lucide-react";
import AddElementsSheet from "./editor-rightsidebar/add-visual-compoents";

interface EditorHeaderProps {
  setSeen: React.Dispatch<React.SetStateAction<string>>;
  seen: string;
}

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const EditorHeader: FC<EditorHeaderProps> = ({ seen, setSeen }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const toggleSeen = () => {
    if (seen === "ADD-COMPONENT") {
      setSeen("");
    } else {
      setSeen("ADD-COMPONENT");
    }
  };
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const openNewWindowSite = () => console.log("hello");
  return (
    <TooltipProvider>
      <div className="w-full h-[55px] border-b dark:border-zinc-900  flex items-center justify-between px-4">
        <div className="w-[30%] h-full flex justify-start items-center gap-x-4">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="bg-white dark:bg-[#252525] border rounded-xl text-black h-8 w-8 dark:text-white"
                onClick={() => {
                  setTheme("light");
                  router.push("/");
                }}
              >
                <ArrowRight className=" w-6 h-6 " />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>العودة إلى لوحة القيادة</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleSeen}
                variant="secondary"
                className={`w-8 h-8 p-2 border bg-white dark:bg-[#252525] rounded-xl dark:text-white  `}
              >
                <Plus className="w-4 h-4 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              إضافة abd this is a test to see if it working or notعنصر
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="w-[50%] h-full flex justify-center items-center gap-x-4">
          <Select>
            <SelectTrigger className="w-[300px] h-8 dark:bg-[#252525]">
              <SelectValue placeholder="الصفحة الرئيسية" />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#252525]">
              <SelectItem value="light">الصفحة الرئيسية</SelectItem>
              <SelectItem value="dark">صفحة عني</SelectItem>
              <SelectItem value="system">صفحة الدورات</SelectItem>
            </SelectContent>
          </Select>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                className={`w-8 h-8 p-2 border bg-white dark:bg-[#252525] rounded-xl dark:text-white  `}
              >
                <FilePlus className="w-4 h-4 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>إضافة صفحة جديدة</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-[20%] h-full flex items-center justify-end gap-x-3">
          <PublishWebsite />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EditorHeader;
