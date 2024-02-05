"use client";

import type { FC } from "react";
import ThemeEditorRightbar from "./theme-editor-rightbar";
import PagePainter from "./page-painter";
import ThemeEditorHeader from "./theme-editor-header";

interface ThemeEditorBoardProps {}

const ThemeEditorBoard: FC = ({}) => {
  return (
    <>
      <ThemeEditorHeader />
      <div className="w-full flex h-full  mt-[70px]">
        <ThemeEditorRightbar />
        <PagePainter />
      </div>
    </>
  );
};

export default ThemeEditorBoard;
