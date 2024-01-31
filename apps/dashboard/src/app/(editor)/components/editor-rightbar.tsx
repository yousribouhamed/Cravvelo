import type { FC } from "react";
import { WebSitePage } from "@/src/types";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/ui/accordion";

import { useWebSiteEditor } from "../editor-state";
import { Component, Type } from "lucide-react";
import { Puzzle } from "lucide-react";

interface EditorRightbarAbdullahProps {}

const EditorRightbar: FC<EditorRightbarAbdullahProps> = ({}) => {
  const { state } = useWebSiteEditor();
  return (
    <ScrollArea className="w-[300px]  shadow border-l  dark:border-zinc-900  h-full pb-10 ">
      <Tabs defaultValue="layouts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-zinc-950">
          <TabsTrigger value="layouts">طبقات</TabsTrigger>
          <TabsTrigger value="assets">أصول</TabsTrigger>
        </TabsList>
        <TabsContent
          value="assets"
          className="w-full h-full flex flex-col "
        ></TabsContent>
        <TabsContent
          value="layouts"
          className="w-full h-full flex flex-col py-8"
        >
          {state.editor.pages[state.editor.selectedPageIndex].elements.map(
            (item) => (
              <Accordion key={item.id} type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger asChild>
                    <button className="text-white w-full flex items-center justify-end  pr-8 gap-x-4">
                      {item.name}
                      <Component className="text-violet-500 w-4 h-4" />
                    </button>
                  </AccordionTrigger>
                  <AccordionContent className="mt-4 ">
                    {Array.isArray(item.content) &&
                      item.content?.map((item) => (
                        <button
                          key={item.id}
                          className="w-full h-[40px] flex items-center justify-end text-white pr-16  gap-x-4"
                        >
                          {item.name}
                          {item.type === "TEXT" ? (
                            <Type className="text-white w-4 h-4" />
                          ) : (
                            <Puzzle className="text-white w-4 h-4" />
                          )}
                        </button>
                      ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )
          )}
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
};

export default EditorRightbar;
