"use client";

import type { FC } from "react";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import { useWebSiteEditor } from "../../editor-state";
//@ts-ignore
import ColorPicker, { useColorPicker } from "react-best-gradient-color-picker";

interface colorPickerAbdullahProps {}

export const BackGroundPicker: FC = ({}) => {
  const { state, actions } = useWebSiteEditor();
  const [color, setColor] = React.useState(
    "linear-gradient(90deg, rgba(96,93,93,1) 0%, rgba(255,255,255,1) 100%)"
  );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-[150px] h-8  cursor-pointer px-1 rounded-xl dark:bg-white/10 flex items-center justify-end gap-x-2">
          <span
            dir="ltr"
            className="dark:text-white text-black text-xs font-bold"
          >
            {state.editor.selectedElement.styles.background}
          </span>
          <div
            className="w-8 h-8 rounded-xl "
            style={{
              background:
                state.editor.selectedElement.styles.background ?? "#fff",
            }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="bg-[#252525] w-[300px] h-[350px] rounded-2xl "
      >
        <ColorPicker
          width={200}
          height={200}
          value={color}
          onChange={setColor}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
