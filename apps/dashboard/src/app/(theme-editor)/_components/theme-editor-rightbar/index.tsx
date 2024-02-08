"use client";

import { Dispatch, SetStateAction, useState, type FC } from "react";
import { LayoutPanelTop } from "lucide-react";
import { Settings } from "lucide-react";
import { FolderCog } from "lucide-react";
import TreeCompoent from "./tree-compoent";
import { cn } from "@ui/lib/utils";
import { Component } from "lucide-react";
import DragDropComponents from "./drag-drop-components";
import DragDropAssets from "./drag-drop-assets";
import SystemDesignConfig from "./system-design-config";
import { TooltipProvider } from "@ui/components/ui/tooltip";

interface ThemeEditorRightbarProps {}

type Views = "LAYOUTS" | "ASSETS" | "DESIGN_SYSTEM" | "BUILDER";

const ThemeEditorRightbar: FC = ({}) => {
  const [view, setView] = useState<Views>("LAYOUTS");
  return (
    <div className="w-[25%] max-w-[350px] border-l flex   h-full ">
      {/* <DragDropComponents /> */}
      <NavigationMenu setState={setView} state={view} />
      {view === "LAYOUTS" ? (
        <TreeCompoent />
      ) : view === "BUILDER" ? (
        <DragDropComponents />
      ) : view === "ASSETS" ? (
        <DragDropAssets />
      ) : view === "DESIGN_SYSTEM" ? (
        <SystemDesignConfig />
      ) : null}
    </div>
  );
};

export default ThemeEditorRightbar;

const NavigationMenu = ({
  setState,
  state,
}: {
  state: Views;
  setState: Dispatch<SetStateAction<Views>>;
}) => {
  return (
    <TooltipProvider>
      <div className="w-[60px] h-full flex flex-col items-center gap-y-4 pt-8 border-l ">
        <button
          className={cn(
            "w-[40px] h-[40px] bg-white rounded-xl flex items-center justify-center text-black",
            {
              "text-primary bg-secondary ": state === "LAYOUTS",
            }
          )}
          onClick={() => setState("LAYOUTS")}
        >
          <LayoutPanelTop className="w-4 h-4 " />
        </button>

        <button
          className={cn(
            "w-[40px] h-[40px] bg-white rounded-xl flex items-center justify-center text-black",
            {
              "text-primary bg-secondary ": state === "DESIGN_SYSTEM",
            }
          )}
          onClick={() => setState("DESIGN_SYSTEM")}
        >
          <Settings className="w-4 h-4 " />
        </button>

        <button
          className={cn(
            "w-[40px] h-[40px] bg-white rounded-xl flex items-center justify-center text-black",
            {
              "text-primary bg-secondary ": state === "BUILDER",
            }
          )}
          onClick={() => setState("BUILDER")}
        >
          <Component className="w-4 h-4 " />
        </button>

        <button
          className={cn(
            "w-[40px] h-[40px] bg-white rounded-xl flex items-center justify-center text-black",
            {
              "text-primary bg-secondary ": state === "ASSETS",
            }
          )}
          onClick={() => setState("ASSETS")}
        >
          <FolderCog className="w-4 h-4 " />
        </button>
      </div>
    </TooltipProvider>
  );
};
