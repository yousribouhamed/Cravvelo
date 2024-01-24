import Image from "next/image";
import type { FC } from "react";
import { useEditorStore } from "@/src/lib/zustand/editor-state";
interface HeroAbdullahProps {}

const Hero: FC = ({}) => {
  const { selectComponent } = useEditorStore();
  return (
    <div
      onClick={() => selectComponent("HERO")}
      className="w-full h-[400px] relative hover:border-2 hover:border-green-500  group cursor-pointer"
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
