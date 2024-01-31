"use client";

import { useMounted } from "@/src/hooks/use-mounted";
import { EditorElement, WebSitePage } from "../../../types";
import { useWebSiteEditor } from "../editor-state";
import Text from "./elements-placeholder/basic/text";
import AnnouncementBar from "./elements-placeholder/complex/announcement-bar";

function PagePainter() {
  const {
    actions: { getWebPage },
  } = useWebSiteEditor();

  const isMounted = useMounted();

  if (!isMounted) {
    return null;
  }
  const pages = getWebPage();
  return (
    <div className="w-[1000px] h-fit min-h-[2000px] bg-white ">
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
