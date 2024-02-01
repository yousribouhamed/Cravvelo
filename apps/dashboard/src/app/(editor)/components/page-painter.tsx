"use client";

import { useMounted } from "@/src/hooks/use-mounted";
import { EditorElement, WebSitePage } from "../../../types";
import { useWebSiteEditor } from "../editor-state";
import Text from "./elements-placeholder/basic/text";
import AnnouncementBar from "./elements-placeholder/complex/announcement-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

function PagePainter() {
  const {
    actions: { getWebPage },
    state,
  } = useWebSiteEditor();

  const isMounted = useMounted();

  const [isBodySelected, setIsBodySelected] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsBodySelected(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsBodySelected(false);
    }, 5000); // 5000 milliseconds = 5 seconds
  };

  if (!isMounted) {
    return <h1>loading...</h1>;
  }
  const pages = getWebPage();
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-[1000px] h-fit min-h-[2000px] bg-white relative hover:border-1 hover:border-yellow-500 group  "
    >
      {isBodySelected && state.isSelectionMode && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="w-[1000px] h-fit min-h-[50px] bg-white/30  flex items-center justify-between absolute -top-20 rounded-2xl px-4  hover:bg-blue-500/30"
        >
          <h2 className="text-white font-bold text-lg">عرض سطح المكتب</h2>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="text-white w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>اختار نقطة انقطاع جديدة</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>عرض الكمبيوتر اللوحي</DropdownMenuItem>
              <DropdownMenuItem>واجهه جوال</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {pages?.elements?.map((item, index) => processComponent(item))}
    </div>
  );
}

export function processComponent(component: EditorElement) {
  switch (component.type) {
    case "ANNOUNCEMENTBAR":
      return <AnnouncementBar element={component} />;
    case "TEXT":
      return <Text element={component} />;

    default:
      <h1>this is not a valid componet</h1>;
  }
}

export default PagePainter;
