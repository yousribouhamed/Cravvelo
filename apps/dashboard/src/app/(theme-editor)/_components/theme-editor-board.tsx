"use client";

import type { FC } from "react";
import ThemeEditorRightbar from "./theme-editor-rightbar";
import PagePainter from "./page-painter";
import ThemeEditorHeader from "./theme-editor-header";
import { ThemePage, useThemeEditorStore } from "../theme-editor-store";
import React from "react";

interface ThemeEditorBoardProps {
  pages: ThemePage[];
}

const ThemeEditorBoard: FC<ThemeEditorBoardProps> = ({ pages }) => {
  const setInitialPages = useThemeEditorStore(
    (state) => state.actions.setInitialPages
  );

  React.useEffect(() => {
    if (pages) {
      setInitialPages(pages);
    }

    console.log(pages);
  }, []);

  return (
    <>
      <ThemeEditorHeader pages={pages} />
      <div className="w-full flex h-full  mt-[60px]">
        <ThemeEditorRightbar />
        <PagePainter />
      </div>
    </>
  );
};

export default ThemeEditorBoard;
