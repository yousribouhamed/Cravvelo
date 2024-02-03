import { EditorElement } from "@/src/types";
import type { FC } from "react";

interface ElementProps {
  element: EditorElement;
}

const TextPlaceHolderProduction: FC<ElementProps> = ({ element }) => {
  return (
    <p
      style={{
        ...element.styles,
      }}
    >
      {/* @ts-ignore */}
      {element?.content?.innerText}
    </p>
  );
};

export default TextPlaceHolderProduction;
