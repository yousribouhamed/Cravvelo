"use client";

import type { FC } from "react";
import EditorRightbar from "./editor-rightbar";
import EditorHeader from "./editor-header";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import EditorCanvas from "./editor-canvas";
import EditorLeftSideBar from "./editor-leftsidebar";
import { Button } from "@ui/components/ui/button";
import { Moon, MousePointer, Sun } from "lucide-react";
import { Hand } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { useWebSiteEditor } from "../editor-state";
import { cn } from "@ui/lib/utils";

const EditorBoard: FC = () => {
  const { state, actions } = useWebSiteEditor();
  const { theme, setTheme } = useTheme();
  return (
    <>
      <EditorHeader />
      <div className="w-full h-full flex relative ">
        <EditorRightbar />
        <div className="w-[60%] flex-grow min-h-full h-fit bg-gray-50 dark:bg-white/10 flex items-center justify-center">
          <EditorCanvas />
        </div>
        <EditorLeftSideBar />

        <div
          dir="ltr"
          className="w-[330px] h-[60px] p-4 rounded-2xl absolute bottom-20 left-[40%] right-[40%] z-[99] dark:bg-neutral-950 flex items-center justify-center gap-x-4"
        >
          <Button
            onClick={() => {
              if (state.isSelectionMode) return;
              actions.toggleSelectionMode();
            }}
            size="icon"
            variant="ghost"
            className={cn(
              " hover:bg-transparent  hover:text-white text-gray-50",
              {
                "text-white bg-white/10": state.isSelectionMode,
              }
            )}
          >
            <MousePointer className={cn(" w-4 h-4 hover:bg-transparent")} />
          </Button>

          <Button
            onClick={() => {
              if (!state.isSelectionMode) return;
              actions.toggleSelectionMode();
            }}
            size="icon"
            variant="ghost"
            className={cn(
              " hover:bg-transparent hover:text-white  text-gray-50",
              {
                "text-white bg-white/10": !state.isSelectionMode,
              }
            )}
          >
            <Hand className={cn("text-gray-50 w-4 h-4 hover:bg-transparent")} />
          </Button>

          <Button
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
            }}
            size="icon"
            variant="ghost"
            className="bg-transparent hover:bg-transparent hover:text-white"
          >
            {theme === "dark" ? (
              <Sun className="dark:text-white text-black w-4 h-4" />
            ) : (
              <Moon className="dark:text-white text-black w-4 h-4" />
            )}
          </Button>

          <Select>
            <SelectTrigger className="w-[150px] h-10 dark:bg-zinc-900">
              <SelectValue placeholder="100%" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default EditorBoard;
