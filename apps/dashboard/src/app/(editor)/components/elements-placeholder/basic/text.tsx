import { EditorElement } from "@/src/types";
import type { FC } from "react";
import { useWebSiteEditor } from "../../../editor-state";

interface textProps {
  element: EditorElement;
}

const Text: FC<textProps> = ({ element }) => {
  const { state, actions } = useWebSiteEditor();

  const handleSelectElement = () => {
    actions.selectElement(element);
  };

  return (
    <p
      onClick={handleSelectElement}
      className={`text-xl ${
        state.isSelectionMode ? "hover:border-blue-500 hover:border-2 " : ""
      } ${
        state.editor.selectedElement.id === element.id && state.isSelectionMode
          ? "border-2 border-violet-500"
          : ""
      }`}
      style={element.styles}
    >
      {/* @ts-ignore */}
      {element?.content?.innerText}
    </p>
  );
};

export default Text;
