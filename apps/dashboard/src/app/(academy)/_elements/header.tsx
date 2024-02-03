import { EditorElement } from "@/src/types";
import type { FC } from "react";

import { processComponentProduction } from "./page-painter";

interface ElementProps {
  element: EditorElement;
}

const HeaderPlaceholderProduction: FC<ElementProps> = ({ element }) => {
  return (
    <div
      style={{
        ...element.styles,
      }}
    >
      {Array.isArray(element.content) &&
        element.content.map((item) => processComponentProduction(item))}
    </div>
  );
};

export default HeaderPlaceholderProduction;
