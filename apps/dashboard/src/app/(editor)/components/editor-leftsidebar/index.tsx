"use client";

import type { FC } from "react";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { useWebSiteEditor } from "../../editor-state";
import { EditeSize } from "./edit-size";
import { EditeLayout } from "./edit-layout";
import { EditeStyles } from "./edite-styles";
import { EditeText } from "./edite-text";
import { EditeDimations } from "./edit-dimations";

const EditorLeftSideBar: FC = ({}) => {
  const { state } = useWebSiteEditor();
  return (
    <aside className="w-[300px] h-full dark:border-r-zinc-900 border-r ">
      <ScrollArea className=" w-full  h-full   ">
        <div className="w-full flex flex-col  z-[999]  h-fit items-center p-4 py-8">
          <EditeSize state={state} />
          <EditeDimations state={state} />
          <EditeLayout state={state} />
          <EditeStyles state={state} />
          <EditeText state={state} />
        </div>
      </ScrollArea>
    </aside>
  );
};

export default EditorLeftSideBar;
