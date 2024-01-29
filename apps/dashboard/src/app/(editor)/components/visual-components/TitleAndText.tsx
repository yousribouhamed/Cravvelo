import { useEditorStore } from "@/src/lib/zustand/editor-state";
import type { FC } from "react";
import AddVisualCompoents from "../add-visual-compoents";
import { ComponentBuilder } from "@/src/types";

interface TitleAndTextProps {
  component: ComponentBuilder;
}

const TitleAndText: FC<TitleAndTextProps> = ({ component }) => {
  const { selectComponent } = useEditorStore();
  return (
    <div
      onClick={() => selectComponent("TITLEANDTEXT")}
      className="w-full h-fit min-h-[100px] flex flex-col "
    >
      <h2>{component.content[0].text}</h2>
      <p>{component.content[0].text}</p>
    </div>
  );
};

export default TitleAndText;
