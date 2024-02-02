import { EditorElement } from "@/src/types";
import type { FC } from "react";
import { useWebSiteEditor } from "../../../editor-state";
import Link from "next/link";

interface elementProps {
  element: EditorElement;
}

const ButtonPlaceHolder: FC<elementProps> = ({ element }) => {
  const { state, actions } = useWebSiteEditor();

  const handleSelectElement = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation(); // Stop event bubbling
    event.nativeEvent.stopImmediatePropagation();
    actions.selectElement(element);
  };

  return (
    <button
      onClick={handleSelectElement}
      className={`  ${
        state.isSelectionMode ? "hover:border-blue-500 hover:border-2 " : ""
      } ${
        state.editor.selectedElement.id === element.id && state.isSelectionMode
          ? "border-2 border-blue-500"
          : ""
      }`}
      style={{
        ...element.styles,
      }}
    >
      {/* @ts-ignore */}
      {element?.content?.innerText}
    </button>
  );
};

export default ButtonPlaceHolder;
