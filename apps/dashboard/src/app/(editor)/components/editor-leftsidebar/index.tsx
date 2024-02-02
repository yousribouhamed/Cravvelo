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

const EditorLeftSideBar: FC = ({}) => {
  const { state } = useWebSiteEditor();
  return (
    <ScrollArea className="  w-[300px] border-r h-full  dark:border-r-zinc-900 ">
      <aside className="w-full flex flex-col  h-fit items-center p-4 py-8">
        <EditeSize state={state} />
        <EditeLayout state={state} />
        <EditeStyles state={state} />
        <EditeText state={state} />
      </aside>
    </ScrollArea>
  );
};

export default EditorLeftSideBar;

const EditeLayout = ({ state }: { state: EditorState }) => {
  const { actions } = useWebSiteEditor();
  return (
    <div dir="rtl" className="w-full h-fit flex flex-col px-4 ">
      <h2 className="text-white font-bold text-md">تَخطِيط</h2>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50 text-sm">محاذاة</span>
        <ToggleGroup
          type="single"
          defaultValue="CENTER  "
          className="w-[150px] h-10 rounded-xl"
        >
          <ToggleGroupItem
            onClick={() =>
              actions.updateElement({
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  alignItems: "flex-start",
                },
              })
            }
            className=" h-10"
            value="LEFT"
          >
            <AlignLeft className="text-white w-4 h-4 " />
          </ToggleGroupItem>
          <ToggleGroupItem
            onClick={() =>
              actions.updateElement({
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  alignItems: "center",
                },
              })
            }
            className=" h-8"
            value="CENTER"
          >
            <AlignCenter className="text-white w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            onClick={() =>
              actions.updateElement({
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  alignItems: "flex-end",
                },
              })
            }
            className=" h-8"
            value="RIGHT"
          >
            <AlignRight className="text-white w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50 text-sm">توزيع</span>
        <Select
          onValueChange={(value) => {
            actions.updateElement({
              ...state.editor.selectedElement,
              styles: {
                ...state.editor.selectedElement.styles,
                justifyContent: "space-between",
              },
            });
          }}
        >
          <SelectTrigger className="w-[150px] h-10 dark:bg-zinc-900">
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

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-sm">فجوة</span>
        <div className="w-[150px] h-[50px] my-2 flex items-center justify-end gap-x-2">
          <Input
            onChange={(e) => {
              actions.updateElement({
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  margin: e.target.value + "px",
                },
              });
            }}
            value={state.editor.selectedElement.styles.margin}
            className="w-[70px] h-10"
          />
          <Slider className="w-[70px]" defaultValue={[33]} max={100} step={1} />
        </div>
      </div>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50  text-sm">حشوة</span>
        <div className="w-[150px] h-[50px] my-2 flex items-center justify-end gap-x-2">
          <Input
            onChange={(e) => {
              actions.updateElement({
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  padding: e.target.value + "px",
                },
              });
            }}
            value={state.editor.selectedElement.styles.padding}
            className="w-[70px] h-10"
          />
          <Slider
            className="w-[70px] h-[2px]"
            defaultValue={[33]}
            max={100}
            step={1}
            onChange={(val) => {
              console.log(val);
            }}
          />
        </div>
      </div>
    </div>
  );
};

const EditeStyles = ({ state }: { state: EditorState }) => {
  const { actions } = useWebSiteEditor();

  return (
    <div dir="rtl" className="w-full h-fit flex flex-col px-4">
      <h2 className="text-white font-bold text-md">الأنماط</h2>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50 text-sm">مرئي</span>
        <ToggleGroup
          type="single"
          defaultValue="Horizontal"
          className="w-[150px] h-10 bg-transparent p-2 rounded-xl"
        >
          <ToggleGroupItem
            onClick={() => {
              actions.updateElement({
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  display: "none",
                },
              });
            }}
            className="w-[90px] h-10"
            value="Vertical"
          >
            <span className="font-bold text-white"> لا</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            onClick={() => {
              actions.updateElement({
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  display: "block",
                },
              });
            }}
            className="w-[90px] h-8 bg-transparent"
            value="Horizontal"
          >
            <span className="font-bold text-white"> نعم</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-sm">ملء الخلفية</span>

        <Popover>
          <PopoverTrigger asChild>
            <div className="w-[150px] h-10  cursor-pointer px-1 rounded-xl dark:bg-white/10 flex items-center justify-end gap-x-2">
              <span
                dir="ltr"
                className="dark:text-white text-black text-sm font-bold"
              >
                {state.editor.selectedElement.styles.background}
              </span>
              <div
                className="w-8 h-8 rounded-xl "
                style={{
                  background: state.editor.selectedElement.styles.background,
                }}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-fit h-fit dark:!bg-black ">
            <SketchPicker
              onChange={(color) => {
                actions.updateElement({
                  ...state.editor.selectedElement,
                  styles: {
                    ...state.editor.selectedElement.styles,
                    background: color?.hex ?? "#FFF",
                  },
                });
              }}
              className="dark:!bg-black dark:!text-white"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-sm">نصف القطر</span>

        <Input
          onChange={(e) => {
            actions.updateElement({
              ...state.editor.selectedElement,
              styles: {
                ...state.editor.selectedElement.styles,
                borderRadius: e.target.value + "px",
              },
            });
          }}
          value={state.editor.selectedElement.styles.borderRadius}
          className="w-[150px] h-10"
        />
      </div>

      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50  text-sm">حدود</span>
        <Input
          onChange={(e) => {
            actions.updateElement({
              ...state.editor.selectedElement,
              styles: {
                ...state.editor.selectedElement.styles,
                border: e.target.value + "px",
              },
            });
          }}
          value={state.editor.selectedElement.styles.border}
          className="w-[150px] h-10"
        />
      </div>
    </div>
  );
};

const EditeText = ({ state }: { state: EditorState }) => {
  const { actions } = useWebSiteEditor();
  return (
    <div dir="rtl" className="w-full h-fit flex flex-col px-4">
      <h2 className="text-white font-bold text-md">كتابة</h2>

      {/* this is section */}
      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-sm">الوزن</span>
        <Input
          onChange={(e) => {
            actions.updateElement({
              ...state.editor.selectedElement,
              styles: {
                ...state.editor.selectedElement.styles,
                fontWeight: e.target.value + "px",
              },
            });
          }}
          value={state.editor.selectedElement.styles.fontWeight}
          className="w-[150px] h-10"
        />
      </div>

      {/* this is section */}
      {/* <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50 text-sm">نوع الخط</span>
        <Select>
          <SelectTrigger className="w-[150px] h-10 dark:bg-zinc-900">
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
      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50  text-sm">لون الخط</span>
        <Popover>
          <PopoverTrigger asChild>
            <div className="w-[150px] h-10  cursor-pointer px-1 rounded-xl dark:bg-white/10 flex items-center justify-end gap-x-2">
              <span
                dir="ltr"
                className="dark:text-white text-black text-sm font-bold"
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
                actions.updateElement({
                  ...state.editor.selectedElement,
                  styles: {
                    ...state.editor.selectedElement.styles,
                    color: color?.hex ?? "",
                  },
                });
              }}
              className="dark:!bg-black dark:!text-white"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* this is section */}
      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-sm">تحول</span>
        <Select
          onValueChange={(val) => {
            actions.updateElement({
              ...state.editor.selectedElement,
              styles: {
                ...state.editor.selectedElement.styles,
                //@ts-ignore
                textTransform: val ?? "",
              },
            });
          }}
        >
          <SelectTrigger className="w-[150px] h-10 dark:bg-zinc-900">
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
      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-sm">المحتوى</span>
        <Input
          disabled={Array.isArray(state.editor.selectedElement.content)}
          defaultValue={
            Array.isArray(state.editor.selectedElement.content)
              ? " "
              : state.editor.selectedElement.content?.innerText
          }
          className="w-[150px] h-10"
          onChange={(e) => {
            actions.updateElement({
              ...state.editor.selectedElement,
              content: { innerText: e.target.value },
            });
          }}
        />
      </div>

      {/* this is section */}
      {/* <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
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
      </div> */}

      {/* this is section */}
      <div className="w-full h-[50px] my-2 flex items-center justify-between gap-x-2 ">
        <span className="text-gray-50   text-sm">محاذاة</span>
        <ToggleGroup
          type="single"
          defaultValue="RIGHT"
          className="w-[150px] h-10 rounded-xl"
        >
          <ToggleGroupItem
            onClick={() =>
              actions.updateElement({
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  textAlign: "left",
                },
              })
            }
            className=" h-10"
            value="LEFT"
          >
            <AlignLeft className="text-white w-4 h-4 text-center" />
          </ToggleGroupItem>
          <ToggleGroupItem
            onClick={() =>
              actions.updateElement({
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  textAlign: "center",
                },
              })
            }
            className=" h-8"
            value="CENTER"
          >
            <AlignCenter className="text-white w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            onClick={() =>
              actions.updateElement({
                ...state.editor.selectedElement,
                styles: {
                  ...state.editor.selectedElement.styles,
                  textAlign: "right",
                },
              })
            }
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
