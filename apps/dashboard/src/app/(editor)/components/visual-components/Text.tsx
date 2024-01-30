import { useEditorStore } from "@/src/lib/zustand/editor-state";
import type { FC } from "react";
import AddVisualCompoents from "../add-visual-compoents";
import { ComponentBuilder } from "@/src/types";

interface VirtualComponentProps {
  component: ComponentBuilder;
}

// each component needs to recive a stype and a content props

const Text: FC<VirtualComponentProps> = ({ component }) => {
  const { selectComponent, currentComponent } = useEditorStore();
  return (
    <p
      onClick={() => selectComponent(component)}
      className={`hover:border hover:border-violet-500  z-[20] ${
        currentComponent?.id === component?.id
          ? "border-2 border-violet-500"
          : ""
      }`}
      style={{
        color: component?.style?.textColor,
        fontSize: component.style?.textSize ?? "5px",
        fontWeight: component.style.textThoughness
          ? component.style.textThoughness
          : "500",
      }}
    >
      {component.content}
    </p>
  );
};

export default Text;
