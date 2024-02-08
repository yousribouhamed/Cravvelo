"use client";

import type { FC } from "react";
import DragDropComponents from "./drag-drop-components";
import { LayoutPanelTop } from "lucide-react";
import { Settings } from "lucide-react";
import { FolderCog } from "lucide-react";

interface ThemeEditorRightbarProps {}

const ThemeEditorRightbar: FC = ({}) => {
  return (
    <div className="w-[25%] max-w-[350px] border-l flex   h-full ">
      <div className="w-[52px] h-full flex flex-col items-center gap-y-4 pt-8 border-l ">
        <button className="w-[40px] h-[40px] bg-secondary rounded-xl flex items-center justify-center">
          <LayoutPanelTop className="w-4 h-4 text-primary" />
        </button>

        <button className="w-[40px] h-[40px] bg-white rounded-xl flex items-center justify-center">
          <Settings className="w-4 h-4 text-zinc-500" />
        </button>

        <button className="w-[40px] h-[40px] bg-white rounded-xl flex items-center justify-center">
          <FolderCog className="w-4 h-4 text-zinc-500" />
        </button>
      </div>
      <DragDropComponents />
    </div>
  );
};

export default ThemeEditorRightbar;
