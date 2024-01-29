import { useEditorStore } from "@/src/lib/zustand/editor-state";
import type { FC } from "react";
import AddVisualCompoents from "../add-visual-compoents";
import { ComponentBuilder } from "@/src/types";

interface TextProps {
  component: ComponentBuilder;
}

const Text: FC = ({ component }: TextProps) => {
  const { selectComponent } = useEditorStore();
  return (
    <div
      style={{
        background: component.style.backgroundColor,
      }}
      onClick={() => selectComponent("TEXT")}
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
