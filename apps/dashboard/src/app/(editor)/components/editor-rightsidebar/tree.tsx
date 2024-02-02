"use client";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import type { FC } from "react";
import { useWebSiteEditor } from "../../editor-state";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/ui/accordion";
import { Button } from "@ui/components/ui/button";
import { EditorElement } from "@/src/types";
import { useState } from "react";
import { SplitSquareVertical } from "lucide-react";

interface TreeProps {
  elements: EditorElement[];
}

const Tree: FC<TreeProps> = ({ elements }) => {
  const { actions, state } = useWebSiteEditor();

  const [isSelected, seyIsSelected] = useState(false);
  return (
    <div className="w-full h-fit my-1">
      {elements.map((item) => {
        return (
          <Accordion key={item.id} type="single">
            <AccordionItem value={item.id}>
              <AccordionTrigger asChild>
                <Button
                  onClick={() => actions.selectElement(item)}
                  className={`w-[260px] h-[30px] flex items-center rounded-lg bg-transparent hover:bg-transparent  px-6 justify-end gap-x-4 dark:text-white text-black text-sm font-bold ${
                    state.editor.selectedElement.id === item.id
                      ? "bg-primary"
                      : ""
                  }`}
                >
                  {item.name}
                  <SplitSquareVertical
                    className={`w-4 h-4 ${
                      state.editor.selectedElement.id === item.id
                        ? "text-white"
                        : "text-primary "
                    }`}
                  />
                </Button>
              </AccordionTrigger>
              {Array.isArray(item.content) && item.content.length > 0 ? (
                <AccordionContent className="mr-6">
                  {<Tree elements={item.content} />}
                </AccordionContent>
              ) : null}
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
};

export default Tree;
