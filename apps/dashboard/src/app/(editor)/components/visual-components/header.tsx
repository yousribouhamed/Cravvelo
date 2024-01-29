import { useEditorStore } from "@/src/lib/zustand/editor-state";
import { ComponentBuilder } from "@/src/types";
import type { FC } from "react";

interface VirtualComponentProps {
  component: ComponentBuilder;
}

// each component needs to recive a stype and a content props

const Header: FC<VirtualComponentProps> = ({ component }) => {
  const { selectComponent } = useEditorStore();
  return (
    <div
      style={{
        backgroundColor: component.style.backgroundColor
          ? component.style.backgroundColor
          : "#FFF",
      }}
      onClick={() => selectComponent(component)}
      className="w-full h-[70px] relative bg-white flex items-center justify-between border-b px-4 hover:border-2 hover:border-blue-500  group cursor-pointer "
    >
      <h2 className="text-lg font-extrabold text-start ">شعارك</h2>
      <div className="w-[200px] h-full flex items-center justify-end gap-x-4 ">
        <p>بيت</p>
        <p>الدورات</p>
        <p>معلومات عنا</p>
      </div>
    </div>
  );
};

export default Header;
