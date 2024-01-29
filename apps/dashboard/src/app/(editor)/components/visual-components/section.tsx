import {
  openAddVirtualCompoent,
  useEditorStore,
} from "@/src/lib/zustand/editor-state";
import type { FC } from "react";
import { ComponentBuilder } from "@/src/types";
import { Button } from "@ui/components/ui/button";

interface VirtualComponentProps {
  component: ComponentBuilder;
}

// each component needs to recive a stype and a content props

const Section: FC<VirtualComponentProps> = ({ component }) => {
  const { selectComponent, currentComponent } = useEditorStore();
  const { isOpen, setIsOpen } = openAddVirtualCompoent();
  return (
    <div
      onClick={() => selectComponent(component)}
      style={{
        backgroundColor: component.style.backgroundColor
          ? component.style.backgroundColor
          : "#FFF",
        width: component.style.width ? component.style.backgroundColor : "#FFF",
        height: component.style.height ? component.style.height : "#FFF",
        marginRight: component.style.margineRight
          ? component.style.margineRight
          : "#FFF",
        marginBottom: component.style.marginBottom
          ? component.style.marginBottom
          : "#FFF",
        marginTop: component.style.marginTop
          ? component.style.marginTop
          : "#FFF",
        marginLeft: component.style.marginLeft
          ? component.style.marginLeft
          : "#FFF",
      }}
      className={`h-[40px] relative  w-full   flex items-center justify-center hover:border-2 hover:border-blue-500  group cursor-pointer ${
        currentComponent.id === component.id
          ? "border-[3px] border-blue-500"
          : ""
      } `}
    >
      <Button
        size="sm"
        className="absolute -bottom-8 right-[40%] hidden group-hover:block  text-white bg-blue-500 shadow-2xl shadow-blue-500 rounded-2xl text-sm font-bold "
        onClick={(val) => setIsOpen(true)}
      >
        إضافة قسم
      </Button>
    </div>
  );
};

export default Section;
