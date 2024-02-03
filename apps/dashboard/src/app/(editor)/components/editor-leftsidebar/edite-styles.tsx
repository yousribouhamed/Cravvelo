"use client";

import type { FC } from "react";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { Input } from "@ui/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@ui/components/ui/toggle-group";
import { MoveHorizontal, MoveVertical } from "lucide-react";
import { Slider } from "@ui/components/ui/slider";
import { SketchPicker } from "react-color";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { useWebSiteEditor } from "../../editor-state";
import { AlignCenter } from "lucide-react";
import { AlignLeft } from "lucide-react";
import { AlignRight } from "lucide-react";
import { EditeSize } from "./edit-size";
import { EditorState } from "@/src/types";

export const EditeStyles = ({ state }: { state: EditorState }) => {
  const { actions } = useWebSiteEditor();

  return (
    <div
      dir="rtl"
      className="w-full h-fit flex flex-col px-4  border-t dark:border-[#252525] "
    >
      <h2 className="text-white font-bold text-md my-4 ">الأنماط</h2>

      <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50 text-xs">مرئي</span>
        <ToggleGroup
          type="single"
          defaultValue="Horizontal"
          className="w-[150px] h-8 bg-transparent p-2 rounded-xl"
        >
          <ToggleGroupItem
            onClick={() => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  display: "none",
                },
              };
              actions.updateElement(newElement);
              actions.selectElement(newElement);
            }}
            className="w-[90px] h-8"
            value="Vertical"
          >
            <span className="font-bold text-white"> لا</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            onClick={() => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  display: "block",
                },
              };
              actions.updateElement(newElement);
              actions.selectElement(newElement);
            }}
            className="w-[90px] h-8 bg-transparent"
            value="Horizontal"
          >
            <span className="font-bold text-white"> نعم</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-xs">ملء الخلفية</span>

        <Popover>
          <PopoverTrigger asChild>
            <div className="w-[150px] h-8  cursor-pointer px-1 rounded-xl dark:bg-white/10 flex items-center justify-end gap-x-2">
              <span
                dir="ltr"
                className="dark:text-white text-black text-xs font-bold"
              >
                {state.editor.selectedElement.styles.background}
              </span>
              <div
                className="w-8 h-8 rounded-xl "
                style={{
                  background:
                    state.editor.selectedElement.styles.background ?? "#fff",
                }}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-fit h-fit dark:!bg-black ">
            <SketchPicker
              onChange={(color) => {
                const newElement = {
                  ...state.editor.selectedElement,
                  styles: {
                    ...state.editor.selectedElement.styles,
                    background: color?.hex ?? "#FFF",
                  },
                };
                actions.updateElement(newElement);
                actions.selectElement(newElement);
              }}
              className="dark:!bg-black dark:!text-white"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-xs">نصف القطر</span>

        <Input
          onChange={(e) => {
            const newElement = {
              ...state.editor.selectedElement,
              styles: {
                ...state.editor.selectedElement.styles,
                borderRadius: e.target.value,
              },
            };
            actions.updateElement(newElement);
            actions.selectElement(newElement);
          }}
          value={state.editor.selectedElement.styles.borderRadius}
          className="w-[150px] h-8"
        />
      </div>

      <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50  text-xs">حدود</span>
        <Input
          onChange={(e) => {
            const newElement = {
              ...state.editor.selectedElement,
              styles: {
                ...state.editor.selectedElement.styles,
                border: e.target.value,
              },
            };
            actions.updateElement(newElement);
            actions.selectElement(newElement);
          }}
          value={state.editor.selectedElement.styles.border}
          className="w-[150px] h-8"
        />
      </div>
    </div>
  );
};
