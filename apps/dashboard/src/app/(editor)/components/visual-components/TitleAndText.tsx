import { useEditorStore } from "@/src/lib/zustand/editor-state";
import type { FC } from "react";
import AddVisualCompoents from "../add-visual-compoents";
import { ComponentBuilder } from "@/src/types";

interface VirtualComponentProps {
  component: ComponentBuilder;
}

// each component needs to recive a stype and a content props

const TitleAndText: FC<VirtualComponentProps> = ({ component }) => {
  const { selectComponent } = useEditorStore();
  return (
    <div
      style={{
        backgroundColor: component.style.backgroundColor
          ? component.style.backgroundColor
          : "#FFF",
      }}
      onClick={() => selectComponent(component)}
      className="w-full h-fit min-h-[100px] flex flex-col "
    >
      <h2>{component.content[0].text}</h2>
      <p>{component.content[0].text}</p>
    </div>
  );
};

export default TitleAndText;
