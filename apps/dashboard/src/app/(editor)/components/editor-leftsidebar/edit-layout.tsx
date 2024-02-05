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

export const EditeLayout = ({ state }: { state: EditorState }) => {
  const { actions } = useWebSiteEditor();
  return (
    <div
      dir="rtl"
      className="w-full h-fit flex flex-col px-4 border-t dark:border-[#252525] "
    >
      <h2 className="text-white font-bold text-md my-4">تَخطِيط</h2>

      <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50 text-xs">الاتجاه</span>
        <ToggleGroup
          type="single"
          defaultValue="Horizontal"
          className="w-[150px] h-10 bg-transparent p-2 rounded-xl"
        >
          <ToggleGroupItem
            onClick={() => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  display: "flex",
                  flexDirection: "column",
                },
              };
              //@ts-ignore
              actions.updateElement(newElement);
              //@ts-ignore
              actions.selectElement(newElement);
            }}
            className="w-[90px] h-8"
            value="Vertical"
          >
            <span className="font-bold text-white"> عمودي</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            onClick={() => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  display: "flex",
                  flexDirection: "row",
                },
              };
              //@ts-ignore
              actions.updateElement(newElement);
              //@ts-ignore
              actions.selectElement(newElement);
            }}
            className="w-[90px] h-8 bg-transparent"
            value="Horizontal"
          >
            <span className="font-bold text-white"> افقي</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50 text-xs">محاذاة</span>
        <ToggleGroup
          type="single"
          defaultValue="CENTER  "
          className="w-[150px] h-10 rounded-xl"
        >
          <ToggleGroupItem
            onClick={() => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  alignItems: "flex-start",
                },
              };
              actions.updateElement(newElement);
              actions.selectElement(newElement);
            }}
            className=" h-8"
            value="LEFT"
          >
            <AlignLeft className="text-white w-4 h-4 " />
          </ToggleGroupItem>
          <ToggleGroupItem
            onClick={() => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  alignItems: "center",
                },
              };
              actions.updateElement(newElement);
              actions.selectElement(newElement);
            }}
            className=" h-8"
            value="CENTER"
          >
            <AlignCenter className="text-white w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            onClick={() => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  alignItems: "flex-end",
                },
              };
              actions.updateElement(newElement);
              actions.selectElement(newElement);
            }}
            className=" h-8"
            value="RIGHT"
          >
            <AlignRight className="text-white w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50 text-xs">توزيع</span>
        <Select
          onValueChange={(value) => {
            const newElement = {
              ...state.editor.selectedElement,
              styles: {
                ...state.editor.selectedElement.styles,
                justifyContent: value,
              },
            };
            actions.updateElement(newElement);
            actions.selectElement(newElement);
          }}
        >
          <SelectTrigger className="w-[150px] h-8 dark:bg-[#252525]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="center">center</SelectItem>
            <SelectItem value="flex-start">start</SelectItem>
            <SelectItem value="flex-end">end</SelectItem>
            <SelectItem value="space-between">space bwtween</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-xs">فجوة</span>
        <div className="w-[150px] h-[50px] my-1 flex items-center justify-end gap-x-2">
          <Input
            onChange={(e) => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  margin: e.target.value,
                },
              };
              actions.updateElement(newElement);
              actions.selectElement(newElement);
            }}
            value={state.editor.selectedElement.styles.margin}
            className="w-[70px] h-8"
          />
          <Slider className="w-[70px]" defaultValue={[33]} max={100} step={1} />
        </div>
      </div>

      <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50  text-xs">حشوة</span>
        <div className="w-[150px] h-[50px] my-1 flex items-center justify-end gap-x-2">
          <Input
            onChange={(e) => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  padding: e.target.value,
                },
              };
              actions.updateElement(newElement);
              actions.selectElement(newElement);
            }}
            value={state.editor.selectedElement.styles.padding}
            className="w-[70px] h-8"
          />
          <Slider
            className="w-[70px] h-[2px]"
            defaultValue={[33]}
            max={100}
            step={1}
          />
        </div>
      </div>
    </div>
  );
};
