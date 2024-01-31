import React, { useState } from "react";
import LikeFigmaCanva from "./lib/like-figma";
import PagePainter from "./page-painter";

const EditorCanvas = () => {
  return (
    <div className="w-full h-full relative">
      <LikeFigmaCanva>
        <div className="w-full h-full flex flex-col justify-center items-center bg-blue-500">
          <PagePainter />
        </div>
      </LikeFigmaCanva>
    </div>
  );
};

export default EditorCanvas;
