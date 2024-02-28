import React from "react";
import { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import { ELEMENT_BLOCKQUOTE } from "@udecode/plate-block-quote";
import {
  collapseSelection,
  findNode,
  focusEditor,
  isBlock,
  isCollapsed,
  TElement,
  toggleNodeType,
  useEditorRef,
  useEditorSelector,
} from "@udecode/plate-common";
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from "@udecode/plate-heading";
import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";

import { Icons } from "./text-editor-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  useOpenState,
} from "./dropdown-menu";
import { ToolbarButton } from "./toolbar";

const items = [
  {
    value: ELEMENT_PARAGRAPH,
    label: "فقرة",
    description: "فقرة",
    icon: Icons.paragraph,
  },
  {
    value: ELEMENT_H1,
    label: "عنوان رئيسي",
    description: "عنوان رئيسي",
    icon: Icons.h1,
  },
  {
    value: ELEMENT_H2,
    label: "عنوان صغير",
    description: "عنوان صغير",
    icon: Icons.h2,
  },
  {
    value: ELEMENT_H3,
    label: "عنوان اصغر",
    description: "عنوان اصغر",
    icon: Icons.h3,
  },
  {
    value: ELEMENT_BLOCKQUOTE,
    label: "اقتباس",
    description: "اقتباس",
    icon: Icons.blockquote,
  },
  // {
  //   value: 'ul',
  //   label: 'Bulleted list',
  //   description: 'Bulleted list',
  //   icon: Icons.ul,
  // },
  // {
  //   value: 'ol',
  //   label: 'Numbered list',
  //   description: 'Numbered list',
  //   icon: Icons.ol,
  // },
];

const defaultItem = items.find((item) => item.value === ELEMENT_PARAGRAPH)!;

export function TurnIntoDropdownMenu(props: DropdownMenuProps) {
  const value: string = useEditorSelector((editor) => {
    if (isCollapsed(editor.selection)) {
      const entry = findNode<TElement>(editor, {
        match: (n) => isBlock(editor, n),
      });

      if (entry) {
        return (
          items.find((item) => item.value === entry[0].type)?.value ??
          ELEMENT_PARAGRAPH
        );
      }
    }

    return ELEMENT_PARAGRAPH;
  }, []);

  const editor = useEditorRef();
  const openState = useOpenState();

  const selectedItem =
    items.find((item) => item.value === value) ?? defaultItem;
  const { icon: SelectedItemIcon, label: selectedItemLabel } = selectedItem;

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          pressed={openState.open}
          tooltip="قائمة العناصر"
          isDropdown
          className="w-[150px] space-x-2 flex items-center justify-end "
        >
          <span className="max-lg:hidden text-black">{selectedItemLabel}</span>
          <SelectedItemIcon className="h-4 w-4 text-black " />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[150px]">
        <DropdownMenuRadioGroup
          className="flex flex-col gap-0.5"
          value={value}
          onValueChange={(type) => {
            toggleNodeType(editor, { activeType: type });

            collapseSelection(editor);
            focusEditor(editor);
          }}
        >
          {items.map(({ value: itemValue, label, icon: Icon }) => (
            <DropdownMenuRadioItem
              key={itemValue}
              value={itemValue}
              hideIcon
              className="w-[150px] flex items-center justify-end gap-x-2 px-2 "
            >
              {label}
              <Icon className="mr-2 h-5 w-5" />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
