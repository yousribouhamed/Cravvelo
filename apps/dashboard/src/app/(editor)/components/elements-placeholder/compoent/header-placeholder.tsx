import { EditorElement } from "@/src/types";
import type { FC } from "react";
import { useWebSiteEditor } from "../../../editor-state";
import { processComponent } from "../../page-painter";

interface ElementProps {
  element: EditorElement;
}

const HeaderPlaceholder: FC<ElementProps> = ({ element }) => {
  const { state, actions } = useWebSiteEditor();

  const handleSelectElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    actions.selectElement(element);
  };

  return (
    <div
      onClick={handleSelectElement}
      style={{
        ...element.styles,
      }}
    >
      {Array.isArray(element.content) &&
        element.content.map((item) => processComponent(item))}
    </div>
  );
};

export default HeaderPlaceholder;
