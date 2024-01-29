import Image from "next/image";
import type { FC } from "react";
import { useEditorStore } from "@/src/lib/zustand/editor-state";
import { ComponentBuilder } from "@/src/types";

interface VirtualComponentProps {
  component: ComponentBuilder;
}

// each component needs to recive a stype and a content props

const Hero: FC<VirtualComponentProps> = ({ component }) => {
  const { selectComponent } = useEditorStore();
  return (
    <div
      style={{
        backgroundColor: component.style.backgroundColor
          ? component.style.backgroundColor
          : "#FFF",
      }}
      onClick={() => selectComponent(component)}
      className="w-full h-[400px] relative hover:border-2 hover:border-blue-500  group cursor-pointer"
    >
      <Image
        src="/banner.jpg"
        className="object-cover"
        alt="this is an image  banner of a boy tried to study"
        fill
      />
    </div>
  );
};

export default Hero;
