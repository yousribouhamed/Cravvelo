"use client";

import type { FC } from "react";
import EditorRightbar from "./editor-rightbar";
import EditorHeader from "./editor-header";
import React from "react";
import { WebSitePage } from "@/src/types";
import EditorCanvas from "./editor-canvas";
import EditorLeftSideBar from "./editor-leftsidebar";
import { Button } from "@ui/components/ui/button";
import { MousePointer, Sun } from "lucide-react";
import { Hand } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";

const EditorBoard: FC = () => {
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
          className="w-[330px] h-[60px] p-4 rounded-2xl absolute bottom-20 left-[40%] right-[40%] z-[999] dark:bg-neutral-950 flex items-center justify-center gap-x-4"
        >
          <Button size="icon" variant="ghost">
            <MousePointer className="text-gray-50 w-4 h-4" />
          </Button>

          <Button size="icon" variant="ghost">
            <Hand className="text-gray-50 w-4 h-4" />
          </Button>

          <Button size="icon" variant="ghost">
            <Sun className="text-gray-50 w-4 h-4" />
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
