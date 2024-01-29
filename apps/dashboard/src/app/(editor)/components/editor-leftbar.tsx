import { ComponentBuilder, WebSitePage } from "@/src/types";
import type { FC } from "react";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { useEditorStore } from "@/src/lib/zustand/editor-state";
import { SketchPicker } from "react-color";
import { Input } from "@ui/components/ui/input";
import { Textarea } from "@ui/components/ui/textarea";
import { Label } from "@ui/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import React from "react";
import { useTheme } from "next-themes";

interface EditorLeftbarProps {
  // component: ComponentBuilder;
  page: WebSitePage;
  setPage: React.Dispatch<React.SetStateAction<WebSitePage>>;
}

const EditorLeftbar: FC<EditorLeftbarProps> = ({ page, setPage }) => {
  const { currentComponent, selectComponent } = useEditorStore();
  const [bgColor, setBgColor] = React.useState("#000000");
  const [textColor, setTextColor] = React.useState("#000000");
  const { theme, setTheme } = useTheme();

  const handleChangeColor = (color: string) => {
    const CurrentPage = page;

    const updatedPage = CurrentPage.components.map((item) => {
      if (item.id === currentComponent.id) {
        item.style.backgroundColor = color;
      }

      return item;
    });

    setPage({
      ...page,
      components: updatedPage,
    });
  };

  const handleChangeTextColor = (color: string) => {
    const CurrentPage = page;

    const updatedPage = CurrentPage.components.map((item) => {
      if (item.id === currentComponent.id) {
        item.style.textColor = color;
      }

      return item;
    });

    setPage({
      ...page,
      components: updatedPage,
    });
  };

  const isDarkTheme = theme === "dark";
  return (
    <ScrollArea className="  w-[20%]  max-w-[300px] border-r h-full shadow ">
      <div
        dir="rtl"
        className={`w-full h-full white    ${
          theme === "dark" ? "bg-black" : "bg-white"
        } px-4 py-8`}
      >
        {currentComponent ? (
          <div className="w-full min-h-[500px] h-fit flex flex-col gap-y-4">
            <div className="w-full h-fit min-h-[50px] my-4 pb-2 ">
              <p className={`text-md  text-black dark:text-white`}>الأنماط</p>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="w-[200px] my-2  cursor-pointer  transition-all duration-150 ease-in-out p-1 rounded-xl h-[40px] flex items-center justify-between gap-x-4 mr-4">
                    <p className="text-black text-xs font-semibold dark:text-white">
                      لون الخلفية
                    </p>
                    <div className="flex items-center gap-x-2 dark:bg-white/10 bg-gray-50 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl p-1">
                      <p
                        dir="ltr"
                        className="text-black text-sm block  dark:text-white p-1 px-2 rounded-2xl "
                      >
                        {bgColor}
                      </p>
                      <div
                        style={{
                          backgroundColor: bgColor,
                        }}
                        className=" w-6 h-6 rounded-lg"
                      />
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className=" !bg-white dark:bg-white/10 shadow-xl p-0 border-none "
                >
                  <SketchPicker
                    color={bgColor}
                    onChangeComplete={(val) => {
                      setBgColor(val.hex);
                      handleChangeColor(val.hex);
                    }}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="w-[200px] my-2  cursor-pointer  transition-all duration-150 ease-in-out p-1 rounded-xl h-[40px] flex items-center justify-between gap-x-4 mr-4">
                    <p className="text-black text-xs font-semibold dark:text-white">
                      لون الخط
                    </p>
                    <div className="flex  items-center gap-x-2 dark:bg-white/10 bg-gray-50 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl p-1">
                      <p
                        dir="ltr"
                        className="text-black text-sm block  dark:text-white p-1 px-2 rounded-2xl "
                      >
                        {textColor}
                      </p>
                      <div
                        style={{
                          backgroundColor: textColor,
                        }}
                        className=" w-6 h-6 rounded-lg"
                      />
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className=" !bg-white shadow-xl p-0 border-none "
                >
                  <SketchPicker
                    color={textColor}
                    onChangeComplete={(val) => {
                      setTextColor(val.hex);
                      handleChangeTextColor(val.hex);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-full h-fit mt-2 border-t dark:border-zinc-950 ">
              <p className={`text-md  text-black dark:text-white`}>التمركز</p>
              <div className="w-full h-[200px] flex justify-center items-center flex-col ">
                <div className="w-[70px] h-[70px] rounded-xl dark:bg-white/10 relative flex items-center justify-center ">
                  <div className="w-[30px] h-[30px] rounded-lg dark:bg-white/20 bg-gray-50" />

                  <div className="bg-white/10 w-[70px] h-[30px] absolute -top-12 rounded-xl" />
                  <div className="bg-white/10 w-[70px] h-[30px] absolute -right-20 rounded-xl" />
                  <div className="bg-white/10 w-[70px] h-[30px] absolute -left-20 rounded-xl " />
                  <div className="bg-white/10 w-[70px] h-[30px] absolute -bottom-12 rounded-xl" />
                </div>
              </div>
            </div>

            <div className="w-full h-fit my-2 border-t dark:border-zinc-950 py-2 flex flex-col gap-y-3  ">
              <p
                className={`text-md  ${
                  isDarkTheme ? "text-white" : "text-black"
                }`}
              >
                العنوان
              </p>
              <div className="w-full min-h-[70px] h-fit p-1 ">
                <Textarea
                  rows={2}
                  className="min-h-[70px] w-full dark:bg-white/10 dark:text-white dark:border-zinc-950 "
                />
              </div>

              <p
                className={`text-md  ${
                  isDarkTheme ? "text-white" : "text-black"
                }`}
              >
                النص
              </p>
              <div className="w-full min-h-[70px] h-fit p-1 ">
                <Textarea
                  rows={2}
                  className="min-h-[70px] w-full dark:bg-white/10 dark:text-white dark:border-zinc-950 "
                />
              </div>
            </div>
          </div>
        ) : (
          <h1>there is no compoents at all</h1>
        )}
      </div>
    </ScrollArea>
  );
};

export default EditorLeftbar;
