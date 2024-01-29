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
import { Image, LayoutTemplate } from "lucide-react";

interface EditorRightbarAbdullahProps {
  page: WebSitePage;
}

const EditorRightbar: FC<EditorRightbarAbdullahProps> = ({ page }) => {
  return (
    <ScrollArea className=" w-[20%] max-w-[300px]  shadow border-l  dark:border-zinc-900 h-full pb-10 ">
      <div
        dir="rtl"
        className=" h-full w-full white bg-white dark:bg-black flex flex-col gap-y-2"
      >
        <div className="w-full h-[50px] flex items-center justify-start px-2">
          <h1 className="text-xl font-bold text-black dark:text-white">
            {page.title}
          </h1>
        </div>

        <div className="w-full min-h-[400px] h-fit  ">
          <Accordion type="multiple">
            {page.components.map((item, index) => (
              <AccordionItem
                key={item?.type ? item?.type : "jjdd"}
                value={`item-${index}`}
              >
                <AccordionTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full  flex justify-start  gap-x-4 h-[40px]"
                  >
                    <LayoutTemplate className="text-gray-500 dark:text-gray-50 w-4 h-4" />
                    {item.name}
                  </Button>
                </AccordionTrigger>
                <AccordionContent>
                  {item.content.map((item, index) => (
                    <Button
                      variant="ghost"
                      className="mr-8  w-full flex items-center justify-start gap-x-4"
                      key={item.name + index}
                    >
                      <Image className="text-gray-500 dark:text-gray-50 w-4 h-4" />
                      {item.name}
                    </Button>
                  ))}
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
