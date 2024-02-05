"use client";

import type { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { Button } from "@ui/components/ui/button";
import { ArrowRight, MonitorDot } from "lucide-react";
import { ThemePage, useThemeEditorStore } from "../theme-editor-store";
import { Smartphone } from "lucide-react";
import { Tv } from "lucide-react";
import PublishWebsite from "@/src/components/models/editor/publish-website";
import { trpc } from "../../_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";

interface ThemeEditorHeaderProps {
  pages: ThemePage[];
}

const viewMods = [
  {
    tooltip: "hhhhhh",
    value: "DESKTOP",
    icon: <MonitorDot className="w-4 h-4" />,
  },
  {
    tooltip: "hhhhhh",
    value: "MOBILE",
    icon: <Smartphone className="w-4 h-4" />,
  },
  {
    tooltip: "hhhhhh",
    value: "LARGE",
    icon: <Tv className="w-4 h-4" />,
  },
];

const ThemeEditorHeader: FC<ThemeEditorHeaderProps> = ({ pages }) => {
  const chnageCurrentPage = useThemeEditorStore(
    (state) => state.actions.chnageCurrentPage
  );
  const chnageViewMode = useThemeEditorStore(
    (state) => state.actions.chnageViewMode
  );
  const { state } = useThemeEditorStore();

  const mutation = trpc.saveWebSiteUpdates.useMutation({
    onSuccess: () => {
      maketoast.success();
    },
    onError: (err) => {
      maketoast.error();
      console.error(err);
    },
  });
  return (
    <TooltipProvider>
      <div className="w-full h-[70px] border-b fixed top-0 bg-white flex items-center justify-between px-4">
        <div className="w-[300px] h-full flex items-center justify-start  ">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className={"bg-white border rounded-xl text-black h-10 w-10   "}
              >
                <ArrowRight className=" w-6 h-6 " />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>العودة إلى لوحة القيادة</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="w-[300px] h-full  flex items-center justify-center">
          <Select onValueChange={(val) => chnageCurrentPage(Number(val))}>
            <SelectTrigger className="w-[300px] h-10 dark:bg-[#252525]">
              <SelectValue placeholder="الصفحة الرئيسية" />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#252525]">
              {state.pages.map((item, index) => (
                <SelectItem
                  key={item.name + index}
                  value={index.toString()}
                  className="w-full flex justify-end items-center"
                >
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[300px] h-full flex items-center justify-end gap-x-4">
          {viewMods.map((item) => (
            <Tooltip key={item.value} delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => chnageViewMode(item.value)}
                  size="icon"
                  variant="secondary"
                  className={`bg-white border rounded-xl  h-10 w-10  ${
                    state.viewMode === item.value
                      ? "text-primary"
                      : "text-zinc-600"
                  } `}
                >
                  {item.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          {pages ? (
            <Button
              size="sm"
              className=" text-white h-10 font-bold rounded-2xl bg-primary"
              onClick={() =>
                mutation.mutate({
                  pages: state.pages,
                })
              }
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              حفظ التغييرات
            </Button>
          ) : (
            <PublishWebsite />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ThemeEditorHeader;
