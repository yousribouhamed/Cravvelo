"use client";

import { Input } from "@ui/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@ui/components/ui/toggle-group";
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
import { EditorState } from "@/src/types";

export const EditeText = ({ state }: { state: EditorState }) => {
  const { actions } = useWebSiteEditor();
  return (
    <div
      dir="rtl"
      className="w-full h-fit flex flex-col px-4  border-t dark:border-[#252525] "
    >
      <h2 className="text-white font-bold text-md my-4">كتابة</h2>

      {/* this is section */}
      <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-xs">الوزن</span>
        <Input
          onChange={(e) => {
            const newElement = {
              ...state.editor.selectedElement,
              styles: {
                ...state.editor.selectedElement.styles,
                fontWeight: e.target.value,
              },
            };
            actions.updateElement(newElement);
            actions.selectElement(newElement);
          }}
          value={state.editor.selectedElement.styles.fontWeight}
          className="w-[150px] h-8"
        />
      </div>

      {/* this is section */}
      {/* <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
          <span className="text-gray-50 text-xs">نوع الخط</span>
          <Select>
            <SelectTrigger className="w-[150px] h-8 dark:bg-[#252525]">
              <SelectValue placeholder="عادي" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">عريض</SelectItem>
              <SelectItem value="dark">مائل</SelectItem>
              <SelectItem value="system">إزالة التأثير</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

      {/* this is section */}
      <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50  text-xs">لون الخط</span>
        <Popover>
          <PopoverTrigger asChild>
            <div className="w-[150px] h-8  cursor-pointer px-1 rounded-xl dark:bg-[#252525] flex items-center justify-end gap-x-2">
              <span
                dir="ltr"
                className="dark:text-white text-black text-xs font-bold"
              >
                {state.editor.selectedElement.styles.color ?? "#FC6B00"}
              </span>
              <div
                className="w-8 h-8 rounded-xl "
                style={{
                  backgroundColor:
                    state.editor.selectedElement.styles.color ?? "#FC6B00",
                }}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-fit h-fit dark:!bg-black ">
            <SketchPicker
              onChangeComplete={(color) => {
                const newElement = {
                  ...state.editor.selectedElement,
                  styles: {
                    ...state.editor.selectedElement.styles,
                    color: color?.hex ?? "",
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

      {/* this is section */}
      <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-xs">تحول</span>
        <Select
          onValueChange={(val) => {
            const newElement = {
              ...state.editor.selectedElement,
              styles: {
                ...state.editor.selectedElement.styles,
                //@ts-ignore
                textTransform: val ?? "",
              },
            };
            //@ts-ignore
            actions.updateElement(newElement);

            //@ts-ignore
            actions.selectElement(newElement);
          }}
        >
          <SelectTrigger className="w-[150px] h-8 dark:bg-[#252525]">
            <SelectValue placeholder="حالة طبيعية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uppercase">الأحرف الكبيرة</SelectItem>
            <SelectItem value="lowercase">أحرف صغيرة</SelectItem>
            <SelectItem value="capitalize">إزالة التأثير</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* this is section */}
      <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-xs">المحتوى</span>
        <Input
          disabled={Array.isArray(state.editor.selectedElement.content)}
          defaultValue={
            Array.isArray(state.editor.selectedElement.content)
              ? " "
              : state.editor.selectedElement.content?.innerText
          }
          className="w-[150px] h-8"
          onChange={(e) => {
            const newElement = {
              ...state.editor.selectedElement,
              content: { innerText: e.target.value },
            };
            actions.updateElement(newElement);
            actions.selectElement(newElement);
          }}
        />
      </div>

      {/* this is section */}
      {/* <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
          <span className="text-gray-50  text-xs">زخرفة</span>
          <Select>
            <SelectTrigger className="w-[150px] h-8 dark:bg-[#252525]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

      {/* this is section */}
      <div className="w-full h-[50px] my-1 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-xs">محاذاة</span>
        <ToggleGroup
          type="single"
          defaultValue="RIGHT"
          className="w-[150px] h-8 rounded-xl"
        >
          <ToggleGroupItem
            onClick={() => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  textAlign: "left",
                },
              };
              //@ts-ignore
              actions.updateElement(newElement);
              //@ts-ignore
              actions.selectElement(newElement);
            }}
            className=" h-8"
            value="LEFT"
          >
            <AlignLeft className="text-white w-4 h-4 text-center" />
          </ToggleGroupItem>
          <ToggleGroupItem
            onClick={() => {
              const newElement = {
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  textAlign: "center",
                },
              };
              //@ts-ignore
              actions.updateElement(newElement);
              //@ts-ignore
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
                  textAlign: "right",
                },
              };
              //@ts-ignore
              actions.updateElement(newElement);
              //@ts-ignore
              actions.selectElement(newElement);
            }}
            className=" h-8"
            value="RIGHT"
          >
            <AlignRight className="text-white w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};
