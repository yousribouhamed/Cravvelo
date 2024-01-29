import { useEditorStore } from "@/src/lib/zustand/editor-state";
import type { FC } from "react";
import AddVisualCompoents from "../add-visual-compoents";
import { ComponentBuilder } from "@/src/types";

interface VirtualComponentProps {
  component: ComponentBuilder;
}

// each component needs to recive a stype and a content props

const Text: FC<VirtualComponentProps> = ({ component }) => {
  const { selectComponent } = useEditorStore();
  return (
    <p
      style={{
        color: component.style.textColor ? component.style.textColor : "",
        fontSize: component.style.textSize ? component.style.textSize : "",
        fontWeight: component.style.textThoughness
          ? component.style.textThoughness
          : "",
      }}
    >
      {component.content}
    </p>
  );
};

export default Text;
