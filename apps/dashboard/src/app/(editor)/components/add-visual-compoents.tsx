"use client";
import { EditorElement } from "@/src/types";
import { Button } from "@ui/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@ui/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { defaultStyles } from "@/src/constants/website-template";

import type { FC } from "react";
import { useWebSiteEditor } from "../editor-state";

const ELEMENTS: EditorElement[] = [
  {
    name: "حاوية",
    content: [],
    id: "",
    styles: { ...defaultStyles },
    type: "container",
  },
];

const AddElementsSheet: FC = ({}) => {
  const { actions } = useWebSiteEditor();

  return (
    <Sheet>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              className={`w-8 h-8 p-2 border bg-white dark:bg-zinc-900 rounded-xl dark:text-white  `}
            >
              <Plus className="w-4 h-4 text-white" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>
          إضافة abd this is a test to see if it working or notعنصر
        </TooltipContent>
      </Tooltip>
      <SheetContent className="z-[100] max-w-xl dark:bg-zinc-950 p-12 ">
        {ELEMENTS.map((item) => {
          return (
            <div
              onClick={() => actions.addElement({ ...item, id: uuidv4() })}
              key={item.id}
              className="bg-primary flex items-center justify-center rounded-2xl w-[200px] h-[120px] cursor-pointer hover:bg-orange-700 transition-all duration-300 "
            >
              <h1 className="text-white font-bold text-lg">{item.name}</h1>
            </div>
          );
        })}
      </SheetContent>
    </Sheet>
  );
};

export default AddElementsSheet;
