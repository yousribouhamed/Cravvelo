import type { FC } from "react";
import { processComponent } from "../../page-painter";
import { EditorElement } from "@/src/types";
import { useWebSiteEditor } from "../../../editor-state";
import { cn } from "@ui/lib/utils";

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

  return (
    <div
      onClick={handleSelectElement}
      className={cn(
        ` w-full  relative bg-[#baaef6]  transition-all group  ${
          state.isSelectionMode && element.type === "__body"
            ? "hover:border-blue-500 hover:border "
            : ""
        } ${
          state.editor.selectedElement.id === element.id &&
          state.isSelectionMode &&
          element.type === "__body"
            ? "border border-yellow-500"
            : state.editor.selectedElement.id === element.id &&
              state.isSelectionMode
            ? "border border-violet-500"
            : ""
        }

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
        element.content.map((item) => processComponent(item))}
    </div>
  );
};

export default Container;
