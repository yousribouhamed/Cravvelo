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
    <div
      style={{
        background: component.style.backgroundColor,
      }}
      onClick={() => selectComponent(component)}
    >
      {
        <h1
          style={{
            color: component.style.textColor,
            fontSizeAdjust: component.style.textSize,
          }}
        >
          {component.content[0].text}
        </h1>
      }
    </div>
  );
};

export default Text;
