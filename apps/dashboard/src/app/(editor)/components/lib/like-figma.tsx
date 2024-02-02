import React, { useState } from "react";
import { MapInteraction } from "react-map-interaction";
import { useWebSiteEditor } from "../../editor-state";

/*
  This component provides a map-like interaction to any content that you place in it. It will let
  the user zoom and pan the children by scaling and translating props.children using css.
*/
const LikeFigmaCanva = (props) => {
  const [isDragging, setIsDragging] = useState(false);
  const { state } = useWebSiteEditor();

  return (
    <MapInteraction {...props}>
      {({ translation, scale }) => {
        // todo save this state so later you can stop the  moving mode and keep the same position
        const transform = `translate(${translation.x}px, ${translation.y}px) scale(${scale})`;
        return (
          <div
            onMouseDown={() => setIsDragging(!state.isSelectionMode)}
            onMouseUp={() => setIsDragging(false)}
            onDrag={() => setIsDragging(!state.isSelectionMode)}
            onDragEnd={() => setIsDragging(false)}
            style={{
              height: "100%",
              width: "100%",
              position: "relative", // for absolutely positioned children
              overflow: "hidden",
              touchAction: "none", // Not supported in Safari :(
              msTouchAction: "none",
              cursor: state.isSelectionMode
                ? ""
                : isDragging
                ? "grabbing"
                : "grab",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
            }}
          >
            <div
              style={{
                display: "inline-block", // size to content
                transform: transform,
                transformOrigin: "0 0 ",
              }}
            >
              {props.children}
            </div>
          </div>
        );
      }}
    </MapInteraction>
  );
};

export default LikeFigmaCanva;
