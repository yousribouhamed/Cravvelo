import { EditorElement } from "@/src/types";
import { useWebSiteEditor } from "../../../editor-state";
import { FC } from "react";

interface elementProps {
  element: EditorElement;
}

export const ImagePlaceHolder: FC<elementProps> = ({ element }) => {
  const { state, actions } = useWebSiteEditor();

  const handleSelectElement = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation(); // Stop event bubbling
    event.nativeEvent.stopImmediatePropagation();
    actions.selectElement(element);
  };

  return (
    <img
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
      src={
        //@ts-ignore
        element.content?.src ||
        "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
      }
    />
  );
};
