import type { FC } from "react";
import { WebSitePage } from "@/src/types";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/ui/accordion";
import { Button } from "@ui/components/ui/button";
import { Component, Image, LayoutTemplate } from "lucide-react";
import { useEditorStore } from "@/src/lib/zustand/editor-state";
import { Type } from "lucide-react";
import { Link } from "lucide-react";
import { Wand } from "lucide-react";

interface EditorRightbarAbdullahProps {
  page: WebSitePage;
}

const EditorRightbar: FC<EditorRightbarAbdullahProps> = ({ page }) => {
  const { selectComponent, currentComponent } = useEditorStore();
  return (
    <ScrollArea className=" w-[20%] max-w-[300px]  shadow border-l  dark:border-zinc-900 h-full pb-10 ">
      <div
        dir="rtl"
        className=" h-full w-full white bg-white dark:bg-black flex flex-col gap-y-2"
      >
        <div className="w-full h-[20px] flex items-center justify-start p-4 mt-4">
          <h1 className="text-md   text-black dark:text-white">{page.title}</h1>
        </div>

        <div className="w-full min-h-[400px] h-fit p-4 ">
          <Accordion type="multiple">
            {page?.components?.map((item, index) => (
              <AccordionItem
                key={item?.type ? item?.type : "jjdd"}
                value={`item-${index}`}
              >
                <AccordionTrigger asChild>
                  <Button
                    onClick={() => selectComponent(item)}
                    variant="ghost"
                    className={`w-full dark:hover:bg-white/10 dark:hover:text-white  flex justify-start  gap-x-2 h-[30px] text-sm mr-4 ${
                      currentComponent?.id === item.id
                        ? "bg-violet-500 shadow shadow-violet-500 hover:bg-violet-600 dark:hover:bg-violet-600 text-white"
                        : ""
                    }`}
                  >
                    {/* <LayoutTemplate className="text-gray-500 dark:text-gray-50 w-4 h-4" /> */}
                    <Component
                      className={`w-4 h-4  ${
                        currentComponent?.id === item.id
                          ? "text-white"
                          : "text-violet-500"
                      }`}
                    />
                    {item.name}
                  </Button>
                </AccordionTrigger>
                <AccordionContent className="relative ">
                  {item?.children?.map((item, index) => (
                    <Button
                      onClick={() => selectComponent(item)}
                      variant="ghost"
                      className={`w-full hover:bg-transparent flex justify-start  gap-x-2 h-[30px] mr-8 text-sm rounded-2xl 
                      ${index === 0 ? "mt-4" : ""}
                      ${
                        currentComponent?.id === item.id
                          ? " text-white underline "
                          : ""
                      }
                      `}
                      key={item.name + index}
                    >
                      {item.type === "TEXT" ? (
                        <Type className="text-gray-500 dark:text-gray-50 w-4 h-4" />
                      ) : item.type === "IMAGE" ? (
                        <Image className="text-gray-500 dark:text-gray-50 w-4 h-4" />
                      ) : item.type === "LINK" ? (
                        <Link className="text-gray-500 dark:text-gray-50 w-4 h-4" />
                      ) : (
                        <Wand className="text-gray-500 dark:text-gray-50 w-4 h-4" />
                      )}

                      <p className="text-gray-500 dark:text-gray-50">
                        {" "}
                        {item.name}
                      </p>
                    </Button>
                  ))}

                  <div className="absolute top-0 bottom-0 w-[1px] h-full bg-white right-10" />
                  <div className="absolute  bottom-0 w-[20px] h-[1px] bg-white right-10" />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </ScrollArea>
  );
};

export default EditorRightbar;
