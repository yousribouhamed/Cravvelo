import { EditorElement } from "@/src/types";
import type { FC } from "react";

interface textProps {
  element: EditorElement;
}

const Text: FC<textProps> = ({ element }) => {
  return (
    <p style={element.styles}>
      {/* @ts-ignore */}
      {element?.content?.innerText}
    </p>
  );
};

export default Text;
