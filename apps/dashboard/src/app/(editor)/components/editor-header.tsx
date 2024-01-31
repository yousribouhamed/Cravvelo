"use client";
import { ArrowRight, Monitor, MonitorSmartphone } from "lucide-react";
import type { FC } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { useEditorScreen } from "@/src/lib/zustand/editor-state";
import PublishWebsite from "@/src/components/models/editor/publish-website";
import { useRouter } from "next/navigation";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { WebSitePage } from "@/src/types";
import { Play } from "lucide-react";

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
  const { screen, setScreen } = useEditorScreen();
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
        </div>

        <div className="w-[30%] h-full flex items-center justify-end gap-x-3">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                variant="secondary"
                className={`w-8 h-8 p-2 border bg-white dark:bg-zinc-900 rounded-xl dark:text-white ${
                  screen === "lg" ? "text-blue-500 dark:text-blue-500" : ""
                } `}
              >
                {theme === "dark" ? <Sun /> : <Moon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p> {theme === "dark" ? "وضع الضوء" : "وضع الظلام"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                onClick={() => setScreen("xl")}
                className={`w-8 h-8 p-2 border bg-white dark:bg-zinc-900 rounded-xl dark:text-white ${
                  screen === "xl" ? "text-blue-500 dark:text-blue-500" : ""
                } `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-tablet-smartphone"
                >
                  <rect width="10" height="14" x="3" y="8" rx="2" />
                  <path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4" />
                  <path d="M8 18h.01" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>حجم سطح المكتب</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setScreen("lg")}
                variant="secondary"
                className={`w-8 h-8 p-2 border bg-white dark:bg-zinc-900 rounded-xl dark:text-white${
                  screen === "lg" ? "text-blue-500 dark:text-blue-500" : ""
                } `}
              >
                <MonitorSmartphone />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>حجم المحرر</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                onClick={() => setScreen("sm")}
                className={`w-8 h-8 p-2 border bg-white dark:bg-zinc-900 rounded-xl dark:text-white ${
                  screen === "sm" ? "text-blue-500 dark:text-blue-500" : ""
                }`}
              >
                <Monitor />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>حجم الهاتف الذكي</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                onClick={openNewWindowSite}
                className={`w-8 h-8 p-2 border   rounded-xl text-white bg-blue-500`}
              >
                <Play />
              </Button>
            </TooltipTrigger>
            <TooltipContent></TooltipContent>
          </Tooltip>

          {/* <PublishWebsite page={{}} /> */}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EditorHeader;
