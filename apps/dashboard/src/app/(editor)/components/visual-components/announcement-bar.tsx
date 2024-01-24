import { useEditorStore } from "@/src/lib/zustand/editor-state";
import { Button } from "@ui/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { FC } from "react";

interface AnnouncementBarAbdullahProps {}

const AnnouncementBar: FC = ({}) => {
  const { selectComponent } = useEditorStore();
  return (
    <div
      onClick={() => selectComponent("ANNOUNCEMENTBAR")}
      className="h-[40px] relative bg-white w-full  border-b flex items-center justify-center hover:border-2 hover:border-green-500  group cursor-pointer"
    >
      <p className="text-md font-bold text-black text-center">
        مرحبا بكم في أكاديميتنا
      </p>
      <button className="w-6 h-6 hidden absolute bottom-[-20px] z-[99] right-[48%] rounded-[50%] bg-green-500 group-hover:flex justify-center items-center">
        <PlusCircle className="text-white w-4 h-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
