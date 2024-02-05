"use client";

import { Droppable } from "@hello-pangea/dnd";
import type { FC } from "react";
import DragDropComponents from "./drag-drop-components";

interface ThemeEditorRightbarProps {}

const ThemeEditorRightbar: FC = ({}) => {
  return (
    <div className="w-[20%] max-w-[300px] border-l  h-full ">
      <DragDropComponents />
    </div>
  );
};

export default ThemeEditorRightbar;
