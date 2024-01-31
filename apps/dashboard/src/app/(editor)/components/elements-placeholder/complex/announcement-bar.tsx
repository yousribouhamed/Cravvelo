import type { FC } from "react";
import { processComponent } from "../../page-painter";
import { EditorElement } from "@/src/types";

interface AnnouncementBarProps {
  element: EditorElement;
}

const AnnouncementBar: FC<AnnouncementBarProps> = ({ element }) => {
  return (
    <div className="w-full h-[50px] flex items-center justify-center bg-gray-400">
      {processComponent(element.content[0])}
    </div>
  );
};

export default AnnouncementBar;
