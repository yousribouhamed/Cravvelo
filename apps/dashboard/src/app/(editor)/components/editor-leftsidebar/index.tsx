"use client";

import type { FC } from "react";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { Input } from "@ui/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@ui/components/ui/toggle-group";
import { MoveHorizontal, MoveVertical } from "lucide-react";
import { Slider } from "@ui/components/ui/slider";
import { SketchPicker } from "react-color";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { useWebSiteEditor } from "../../editor-state";
import { AlignCenter } from "lucide-react";
import { AlignLeft } from "lucide-react";
import { AlignRight } from "lucide-react";
import { EditeSize } from "./edit-size";
import { EditorState } from "@/src/types";
import { EditeLayout } from "./edit-layout";
import { EditeStyles } from "./edite-styles";
import { EditeText } from "./edite-text";

const EditorLeftSideBar: FC = ({}) => {
  const { state } = useWebSiteEditor();
  return (
    <ScrollArea className="  w-[300px] border-r h-full  dark:border-r-zinc-900 ">
      <aside className="w-full flex flex-col  h-fit items-center p-4 py-8">
        <EditeSize state={state} />
        <EditeLayout state={state} />
        <EditeStyles state={state} />
        <EditeText state={state} />
      </aside>
    </ScrollArea>
  );
};

export default EditorLeftSideBar;
