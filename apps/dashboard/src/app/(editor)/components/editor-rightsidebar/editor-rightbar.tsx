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

import { useWebSiteEditor } from "../../editor-state";
import { Component, Type } from "lucide-react";
import { Puzzle } from "lucide-react";
import Tree from "./tree";
import AddElementDragDrop from "./add-element-drag-trop";

interface EditorRightbarProps {
  seen: string;
}

const EditorRightbar: FC<EditorRightbarProps> = ({ seen }) => {
  const { state } = useWebSiteEditor();

  if (seen === "ADD-COMPONENT") {
    return <AddElementDragDrop />;
  }
  return (
    <div className="w-[300px]  shadow border-l  dark:border-zinc-900  h-full pb-10 ">
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
          <ScrollArea className="   w-[300px] border-r h-full flex flex-col items-start dark:border-r-zinc-900  ">
            <aside className=" w-[300px] flex flex-col  h-fit min-h-full items-center  px-4">
              <Tree
                elements={
                  state.editor.pages[state.editor.selectedPageIndex].elements
                }
              />
            </aside>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditorRightbar;
