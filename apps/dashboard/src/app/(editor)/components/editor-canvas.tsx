"use client";

import type { FC } from "react";
import { MapInteractionCSS } from "react-map-interaction";

interface EditorCanvasProps {}

const EditorCanvas: FC = ({}) => {
  return (
    <div className="w-full h-full relative">
      <MapInteractionCSS
        className=" w-full h-full"
        defaultValue={{
          scale: 1,
          translation: { x: 0, y: 20 },
        }}
        minScale={0.5}
        maxScale={3}
        translationBounds={{
          xMax: 400,
          yMax: 200,
        }}
      >
        <div className="w-full h-full  flex flex-col justify-center  items-center">
          <div className="w-[400px] h-[800px] bg-white"></div>
        </div>
      </MapInteractionCSS>
    </div>
  );
};

export default EditorCanvas;
