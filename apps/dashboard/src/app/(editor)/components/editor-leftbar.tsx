import { WebSitePage } from "@/src/types";
import type { FC } from "react";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { useEditorStore } from "@/src/lib/zustand/editor-state";
import { SketchPicker } from "react-color";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import React from "react";

interface EditorLeftbarAbdullahProps {
  page: WebSitePage;
}

const EditorLeftbar: FC<EditorLeftbarAbdullahProps> = ({ page }) => {
  const { currentComponent } = useEditorStore();
  const [bgColor, setBgColor] = React.useState("#000000");
  const [textColor, setTextColor] = React.useState("#000000");

  return (
    <ScrollArea className="  w-[20%]  max-w-[300px] border-r h-full shadow ">
      <div dir="rtl" className="w-full h-full white   bg-white px-4 py-8">
        {currentComponent ? (
          <div className="w-full min-h-[500px] h-fit flex flex-col gap-y-4">
            <div className="w-full h-fit min-h-[50px] my-4 pb-2 ">
              <p className="text-md text-black">الأنماط</p>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="w-[200px] cursor-pointer hover:bg-gray-50 transition-all duration-150 ease-in-out p-1 rounded-xl h-[40px] flex items-center justify-between gap-x-4 mr-4">
                    <p className="text-gray-700 text-xs">لون الخلفية</p>
                    <div className="flex items-center gap-x-2">
                      <p className="text-black text-sm block bg-gray-200 p-1 px-2 rounded-2xl ">
                        {bgColor}
                      </p>
                      <div className="bg-emerald-600 w-6 h-6 rounded-lg" />
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className=" !bg-white shadow-xl p-0 border-none ">
                  <SketchPicker color={bgColor} onChangeComplete={setBgColor} />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="w-[200px] cursor-pointer hover:bg-gray-50 transition-all duration-150 ease-in-out p-1 rounded-xl h-[40px] flex items-center justify-between gap-x-4 mr-4">
                    <p className="text-gray-700 text-xs"> لون الخط</p>
                    <div className="flex items-center gap-x-2">
                      <p className="text-black text-sm block bg-gray-200 p-1 px-2 rounded-2xl ">
                        {bgColor}
                      </p>
                      <div className="bg-green-500 w-6 h-6 rounded-lg" />
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className=" !bg-white shadow-xl p-0 border-none ">
                  <SketchPicker
                    color={textColor}
                    onChangeComplete={setTextColor}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-full h-fit mt-2 border-t  ">
              <p className="text-md text-black">التمركز</p>
              <div className="w-full h-[200px] bg-green-500"></div>
            </div>
            <div className="w-full h-fit my-2 border-t py-2 ">
              <p className="text-md text-black my-2 ">النص</p>
              <div className="w-full h-[200px] bg-emerald-600"></div>
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
