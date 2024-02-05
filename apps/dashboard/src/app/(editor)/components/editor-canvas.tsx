import React, { useState } from "react";
import PagePainter from "./page-painter";

const EditorCanvas = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center ">
      <PagePainter />
    </div>
  );
};

export default EditorCanvas;
