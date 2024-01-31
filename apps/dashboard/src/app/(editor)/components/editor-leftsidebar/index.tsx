"use client";

import type { FC } from "react";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { Input } from "@ui/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@ui/components/ui/toggle-group";
import { MoveHorizontal, MoveVertical } from "lucide-react";
import { Slider } from "@ui/components/ui/slider";
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

const EditorLeftSideBar: FC = ({}) => {
  return (
    <ScrollArea className="  w-[300px] border-r h-full  dark:border-r-zinc-900 ">
      <aside className="w-full flex flex-col  h-fit items-center p-4 py-8">
        <EditeSize />
        <EditeLayout />
        <EditeStyles />
        <EditeText />
      </aside>
    </ScrollArea>
  );
};

export default EditorLeftSideBar;

const EditeSize = () => {
  const { actions, state } = useWebSiteEditor();

  return (
    <div dir="rtl" className="w-full h-fit flex flex-col px-4">
      <h2 className="text-white font-bold text-md">مقاس</h2>
      <div className="w-full flex items-center justify-between  ">
        <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
          <span className="text-gray-50 text-sm">عرض</span>
          <Input
            className="w-[70px] h-10"
            value={state.editor.selectedElement.styles.width}
            onChange={(e) =>
              actions.updateElement({
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  width: e.target.value ?? "",
                },
              })
            }
          />
        </div>
        <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
          <span className="text-gray-50 text-sm">ارتفاع</span>
          <Input
            className="w-[70px] h-10"
            value={state.editor.selectedElement.styles.height}
            onChange={(e) =>
              actions.updateElement({
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  height: e.target.value ?? "",
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

const EditeLayout = () => {
  return (
    <div dir="rtl" className="w-full h-fit flex flex-col px-4 ">
      <h2 className="text-white font-bold text-md">تَخطِيط</h2>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50 text-sm">محاذاة</span>
        <ToggleGroup
          type="single"
          defaultValue="Horizontal"
          className="w-[150px] h-10"
        >
          <ToggleGroupItem className=" h-10" value="Vertical">
            <MoveVertical className="text-white w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem className=" h-8" value="Horizontal">
            <MoveHorizontal className="text-white w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem className=" h-8" value="Horizontal">
            <MoveHorizontal className="text-white w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50 text-sm">توزيع</span>
        <Select>
          <SelectTrigger className="w-[150px] h-10 dark:bg-zinc-900">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-sm">فجوة</span>
        <div className="w-[150px] h-[50px] my-2 flex items-center justify-end gap-x-2">
          <Input className="w-[70px] h-10" />
          <Slider className="w-[70px]" defaultValue={[33]} max={100} step={1} />
        </div>
      </div>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50  text-sm">حشوة</span>
        <div className="w-[150px] h-[50px] my-2 flex items-center justify-end gap-x-2">
          <Input className="w-[70px] h-10" />
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

const EditeStyles = () => {
  return (
    <div dir="rtl" className="w-full h-fit flex flex-col px-4">
      <h2 className="text-white font-bold text-md">الأنماط</h2>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50 text-sm">العتامة</span>
        <Select>
          <SelectTrigger className="w-[150px] h-10 dark:bg-zinc-900">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50 text-sm">مرئي</span>
        <ToggleGroup
          type="single"
          defaultValue="Horizontal"
          className="w-[150px] h-10"
        >
          <ToggleGroupItem className="w-[90px] h-10" value="Vertical">
            <MoveVertical className="text-white w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem className="w-[90px] h-8" value="Horizontal">
            <MoveHorizontal className="text-white w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem className="w-[90px] h-8" value="Horizontal">
            <MoveHorizontal className="text-white w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-sm">يملأ</span>
        <div className="w-[150] h-[50px] my-2 flex items-center justify-between gap-x-2 ">
          <Input className="w-[80px] h-8" />
          <div className="w-10 h-10 bg-blue-500" />
        </div>
      </div>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-sm">نصف القطر</span>

        <Input className="w-[150px] h-10" />
      </div>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50  text-sm">حدود</span>
        <div className="w-[150px] h-[50px] my-2 flex items-center justify-start gap-x-2">
          <Input className="w-[80px] h-8" />
          <div className="w-10 h-10 bg-blue-500" />
        </div>
      </div>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50  text-sm">ظل</span>
        <div className="w-[150px] h-[50px] my-2 flex items-center justify-start gap-x-2">
          <Input className="w-[80px] h-8" />
          <div className="w-10 h-10 bg-blue-500" />
        </div>
      </div>
    </div>
  );
};

const EditeText = () => {
  return (
    <div dir="rtl" className="w-full h-fit flex flex-col px-4">
      <h2 className="text-white font-bold text-md">كتابة</h2>

      {/* this is section */}
      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-sm">الوزن</span>
        <Input className="w-[150px] h-10" />
      </div>

      {/* this is section */}
      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50 text-sm">نوع الخط</span>
        <Select>
          <SelectTrigger className="w-[150px] h-10 dark:bg-zinc-900">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* this is section */}
      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50  text-sm">لون</span>
        <div className="w-[150px] h-[50px] my-2 flex items-center justify-start gap-x-2">
          <Input className="w-[80px] h-8" />
          <div className="w-10 h-10 bg-blue-500" />
        </div>
      </div>

      {/* this is section */}
      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-sm">تحول</span>
        <Select>
          <SelectTrigger className="w-[150px] h-10 dark:bg-zinc-900">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* this is section */}
      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50  text-sm">زخرفة</span>
        <Select>
          <SelectTrigger className="w-[150px] h-10 dark:bg-zinc-900">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* this is section */}
      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-sm">محاذاة</span>
        <ToggleGroup
          type="single"
          defaultValue="Horizontal"
          className="w-[150px] h-10"
        >
          <ToggleGroupItem className="w-[90px] h-10" value="Vertical">
            <MoveVertical className="text-white w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem className="w-[90px] h-8" value="Horizontal">
            <MoveHorizontal className="text-white w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem className="w-[90px] h-8" value="Horizontal">
            <MoveHorizontal className="text-white w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};
