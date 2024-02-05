import type { FC } from "react";
import { processComponent } from "../../page-painter";
import { EditorElement } from "@/src/types";
import { useWebSiteEditor } from "../../../editor-state";
import { cn } from "@ui/lib/utils";
import { EditorBtns } from "@/src/constants/website-template";
import { components } from "../../editor-rightsidebar/add-element-drag-trop";
import { v4 as uuidv4 } from "uuid";

interface AnnouncementBarProps {
  element: EditorElement;
}

const Container: FC<AnnouncementBarProps> = ({ element }) => {
  const { state, actions } = useWebSiteEditor();

  const handleSelectElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    actions.selectElement(element);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === "__body") return;
    e.dataTransfer.setData("elementType", type);
  };

  const handleOnDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    const elementType = e.dataTransfer.getData("elementType") as EditorBtns;

    const item = components.find((item) => item.type === elementType);
    if (!item) return;
    actions.selectElement(element);
    actions.addElement({
      ...item,
      id: uuidv4(),
      //@ts-ignore
      content: item.content,
    });
  };

  return (
    <div
      onClick={handleSelectElement}
      className={cn(
        ` w-full  relative bg-[#baaef6]  transition-all group  ${
          state.isSelectionMode && element.type === "__body"
            ? "hover:border-blue-500 hover:border-2 "
            : ""
        } ${
          state.editor.selectedElement.id === element.id &&
          state.isSelectionMode &&
          element.type === "__body"
            ? "border-2 border-blue-500"
            : state.editor.selectedElement.id === element.id &&
              state.isSelectionMode
            ? "border-2 border-blue-500"
            : ""
        }

      `,
        {
          "max-w-full w-full":
            element.type === "container" || element.type === "2Col",
          "h-fit ": element.type === "container",
          "h-full min-h-[1000px]": element.type === "__body",
        }
      )}
      style={{
        ...element.styles,
      }}
      onDrop={handleOnDrop}
      onDragOver={handleDragOver}
      draggable={element.type !== "__body"}
      onDragStart={(e) => handleDragStart(e, "container")}
    >
      {Array.isArray(element.content) &&
        element.content.map((item) => processComponent(item))}
    </div>
  );
};

export default Container;
