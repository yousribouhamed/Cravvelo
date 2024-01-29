import {
  openAddVirtualCompoent,
  useEditorStore,
} from "@/src/lib/zustand/editor-state";
import type { FC } from "react";
import { ComponentBuilder } from "@/src/types";
import { Button } from "@ui/components/ui/button";
import { processComponent } from "../page-painter";

interface VirtualComponentProps {
  component: ComponentBuilder;
}

// each component needs to recive a stype and a content props

const AnnouncementBar: FC<VirtualComponentProps> = ({ component }) => {
  const { selectComponent } = useEditorStore();
  const { isOpen, setIsOpen } = openAddVirtualCompoent();
  return (
    <div
      onClick={() => selectComponent(component)}
      style={{
        backgroundColor: component.style.backgroundColor
          ? component.style.backgroundColor
          : "#FFF",
      }}
      className="h-[40px] relative  w-full  border-b flex items-center justify-center hover:border-2 hover:border-blue-500  group cursor-pointer"
    >
      {processComponent(component.children[0])}
      <Button
        size="sm"
        className="absolute -bottom-8 right-[40%] hidden group-hover:block  text-white bg-primary rounded-2xl text-sm font-bold "
        onClick={(val) => setIsOpen(true)}
      >
        add section
      </Button>
    </div>
  );
};

export default AnnouncementBar;
