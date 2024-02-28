import React from "react";
import {
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
} from "@udecode/plate-basic-marks";
import { useEditorReadOnly } from "@udecode/plate-common";
import { Icons } from "./text-editor-icons";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { ToolbarGroup } from "./toolbar";
import { TurnIntoDropdownMenu } from "./turn-into-dropdown-menu";

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <div className="w-[100%]  h-12 mx-auto border-b border-l border-r   mb-2  ">
      <div
        className="flex flex-wrap justify-end"
        style={{
          transform: "translateX(calc(-1px))",
        }}
      >
        {!readOnly && (
          <>
            <ToolbarGroup>
              <MarkToolbarButton tooltip="غامق (⌘+B)" nodeType={MARK_BOLD}>
                <Icons.bold className=" w-4 h-4" />
              </MarkToolbarButton>
              <MarkToolbarButton tooltip="مائل (⌘+I)" nodeType={MARK_ITALIC}>
                <Icons.italic className=" w-4 h-4" />
              </MarkToolbarButton>
              <MarkToolbarButton
                tooltip="تسطير (⌘+U)"
                nodeType={MARK_UNDERLINE}
              >
                <Icons.underline className=" w-4 h-4" />
              </MarkToolbarButton>

              <MarkToolbarButton
                tooltip="يتوسطه خط (⌘+⇧+M)"
                nodeType={MARK_STRIKETHROUGH}
              >
                <Icons.strikethrough className="w-4 h-4" />
              </MarkToolbarButton>
              <MarkToolbarButton tooltip="الكود (⌘+E)" nodeType={MARK_CODE}>
                <Icons.code className="w-4 h-4" />
              </MarkToolbarButton>
            </ToolbarGroup>

            <ToolbarGroup>
              <TurnIntoDropdownMenu />
            </ToolbarGroup>
          </>
        )}

        {/* <div className="grow" />

        <ToolbarGroup noSeparator>
          <ModeDropdownMenu />
        </ToolbarGroup> */}
      </div>
    </div>
  );
}
