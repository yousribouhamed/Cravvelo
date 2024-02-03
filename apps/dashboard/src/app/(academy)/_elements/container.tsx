import type { FC } from "react";
import { processComponentProduction } from "./page-painter";
import { EditorElement } from "@/src/types";

import { cn } from "@ui/lib/utils";

interface ElementProps {
  element: EditorElement;
}

const ContainerPlaceHolderProduction: FC<ElementProps> = ({ element }) => {
  return (
    <div
      className={cn(
        ` w-full  relative bg-[#baaef6]  transition-all group  

      `,
        {
          "max-w-full w-full":
            element.type === "container" || element.type === "2Col",
          "h-fit ": element.type === "container",
          "h-full min-h-[2000px]": element.type === "__body",
          "w-[1200px]": element.type === "__body",
        }
      )}
      style={{
        ...element.styles,
      }}
    >
      {Array.isArray(element.content) &&
        element.content.map((item) => processComponentProduction(item))}
    </div>
  );
};

export default ContainerPlaceHolderProduction;
