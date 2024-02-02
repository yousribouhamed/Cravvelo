import React, { useState } from "react";
import LikeFigmaCanva from "./lib/like-figma";
import PagePainter from "./page-painter";
import MouseSelectionProvider from "./mouse-selection-provider";

const EditorCanvas = () => {
  return (
    <div className="w-full h-full relative">
      <MouseSelectionProvider>
        <LikeFigmaCanva>
          <div className="w-full h-full flex flex-col justify-center items-center ">
            <PagePainter />
          </div>
        </LikeFigmaCanva>
      </MouseSelectionProvider>
    </div>
  );
};

export default EditorCanvas;
