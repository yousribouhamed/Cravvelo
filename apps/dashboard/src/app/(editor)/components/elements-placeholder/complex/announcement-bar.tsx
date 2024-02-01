import type { FC } from "react";
import { processComponent } from "../../page-painter";
import { EditorElement } from "@/src/types";
import { useWebSiteEditor } from "../../../editor-state";

interface AnnouncementBarProps {
  element: EditorElement;
}

const AnnouncementBar: FC<AnnouncementBarProps> = ({ element }) => {
  const { state, actions } = useWebSiteEditor();

  const handleSelectElement = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation(); // Stop event bubbling
    actions.selectElement(element);
  };

  return (
    <div
      onClick={handleSelectElement}
      className={` w-full flex items-center justify-center bg-gray-400 ${
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
      {processComponent(element.content[0])}
    </div>
  );
};

export default AnnouncementBar;
