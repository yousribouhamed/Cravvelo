import { EditorElement } from "@/src/types";
import type { FC } from "react";
import { useWebSiteEditor } from "../../../editor-state";
import Link from "next/link";

interface textProps {
  element: EditorElement;
}

const ButtonPlaceHolder: FC<textProps> = ({ element }) => {
  const { state, actions } = useWebSiteEditor();

  const handleSelectElement = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation(); // Stop event bubbling
    actions.selectElement(element);
  };

  return (
    <Link
      href="/"
      onClick={handleSelectElement}
      className={`text-md bg-gray-400 text-white  ${
        state.isSelectionMode ? "hover:border-blue-500 hover:border-2 " : ""
      } ${
        state.editor.selectedElement.id === element.id && state.isSelectionMode
          ? "border-2 border-violet-500"
          : ""
      }`}
      style={{
        ...element.styles,

        height: element.styles.height + "px",
        width: element.styles.width + "px",
      }}
    >
      {/* @ts-ignore */}
      {element?.content?.innerText}
    </Link>
  );
};

export default ButtonPlaceHolder;
