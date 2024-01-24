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

const EditorHeader: FC = ({}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  return (
    <TooltipProvider>
      <div className="w-full h-[55px] border-b bg-white flex items-center justify-between px-4">
        <div className="w-[20%] h-full flex justify-start items-center">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="bg-white border rounded-xl"
              >
                <ArrowRight className="text-black  w-6 h-6 " />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>العودة إلى لوحة القيادة</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="w-[50%] h-full flex justify-center items-center gap-x-4">
          <Select>
            <SelectTrigger className="w-[300px] h-10">
              <SelectValue placeholder="الصفحة الرئيسية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">الصفحة الرئيسية</SelectItem>
              <SelectItem value="dark">صفحة عني</SelectItem>
              <SelectItem value="system">صفحة الدورات</SelectItem>
            </SelectContent>
          </Select>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                className="w-8 h-8  border bg-white rounded-xl"
              >
                <FilePlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p> إضافة صفحة جديدة</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="w-[30%] h-full flex items-center justify-end gap-x-3">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                className="w-8 h-8 p-2 border bg-white rounded-xl"
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
                variant="secondary"
                className="w-8 h-8 p-2 border bg-white rounded-xl"
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
                className="w-8 h-8 p-2 border bg-white rounded-xl"
              >
                <Monitor />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>حجم الهاتف الذكي</p>
            </TooltipContent>
          </Tooltip>

          <Button className=" text-white font-bold rounded-2xl">
            حفظ ونشر
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EditorHeader;
