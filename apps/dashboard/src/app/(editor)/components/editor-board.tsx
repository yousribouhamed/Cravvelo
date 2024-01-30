"use client";

import type { FC } from "react";
import AnnouncementBar from "./visual-components/announcement-bar";
import Header from "./visual-components/header";
import Hero from "./visual-components/hero";
import EditorLeftbar from "./editor-leftbar";
import EditorRightbar from "./editor-rightbar";
import EditorHeader from "./editor-header";
import React from "react";
import { WebSitePage } from "@/src/types";
import { useEditorScreen } from "@/src/lib/zustand/editor-state";
import { pageTemplate } from "@/src/constants/website-template";
import PagePainter from "./page-painter";
import AddVisualCompoents from "./add-visual-compoents";
import { trpc } from "../../_trpc/client";

interface EditorBoardProps {
  page: WebSitePage;
  subdomain: string;
}

const EditorBoard: FC<EditorBoardProps> = ({ page, subdomain }) => {
  const [currentpage, setCurrentPage] = React.useState<WebSitePage>(
    page ? page : pageTemplate
  );
  const { screen, setScreen } = useEditorScreen();

  console.log("here it is the website");
  console.log(currentpage);

  return (
    <>
      <EditorHeader page={currentpage} subdomain={subdomain} />
      <AddVisualCompoents page={currentpage} setPages={setCurrentPage} />
      <div className="w-full h-full flex ">
        <EditorRightbar page={currentpage} />
        <div className="w-[60%] flex-grow min-h-full h-fit flex flex-col items-center bg-gray-50 dark:bg-white/10 p-4 ">
          <div
            className={`w-full ${
              screen === "sm"
                ? "max-w-sm"
                : screen === "lg"
                ? "max-w-lg"
                : "max-w-screen-2xl"
            } h-fit   rounded-md  shadow-2xl transition-all duration-300  `}
          >
            <PagePainter page={currentpage} />
          </div>
        </div>
        <EditorLeftbar page={currentpage} setPage={setCurrentPage} />
      </div>
    </>
  );
};

export default EditorBoard;
