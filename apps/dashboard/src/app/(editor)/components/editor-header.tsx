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
import AddElementsSheet from "./add-visual-compoents";

interface EditorHeaderProps {}

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

const EditorHeader: FC<EditorHeaderProps> = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const openNewWindowSite = () => console.log("hello");
  return (
    <TooltipProvider>
      <div className="w-full h-[55px] border-b dark:border-zinc-900  flex items-center justify-between px-4">
        <div className="w-[20%] h-full flex justify-start items-center">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="bg-white dark:bg-white/10 border rounded-xl text-black  dark:text-white"
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
        </div>
        <div className="w-[50%] h-full flex justify-center items-center gap-x-4">
          <Select>
            <SelectTrigger className="w-[300px] h-10 dark:bg-zinc-900">
              <SelectValue placeholder="الصفحة الرئيسية" />
            </SelectTrigger>
            <SelectContent className="dark:bg-zinc-900">
              <SelectItem value="light">الصفحة الرئيسية</SelectItem>
              <SelectItem value="dark">صفحة عني</SelectItem>
              <SelectItem value="system">صفحة الدورات</SelectItem>
            </SelectContent>
          </Select>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                className={`w-10 h-10 p-2 border bg-white dark:bg-zinc-900 rounded-xl dark:text-white  `}
              >
                <FilePlus className="w-4 h-4 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>إضافة صفحة جديدة</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-[30%] h-full flex items-center justify-end gap-x-3">
          <AddElementsSheet />

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={openNewWindowSite}
                className="relative inline-flex h-10  overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-primary px-3 py-1 text-sm  text-white backdrop-blur-3xl font-bold shadow shadow-primary ">
                  نشر موقع الويب
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              ادفع موقع الويب الخاص بك بنقرة زر واحدة واحصل على عنوان URL خاص
              حتى تتمكن من مشاركته مع أصدقائك
            </TooltipContent>
          </Tooltip>

          {/* <PublishWebsite page={{}} /> */}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EditorHeader;
