import React, { useState } from "react";
import { MenuBarProps, MenuButtonProps } from "../types";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Eye,
  Trash2,
  MoreHorizontal,
  Minimize2,
  Maximize2,
} from "lucide-react";

const MenuButton: React.FC<MenuButtonProps> = ({
  onClick,
  isActive = false,
  children,
  disabled = false,
  title,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`h-8 w-8 p-0 rounded-md border transition-all duration-200 flex items-center justify-center ${
      isActive
        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    {children}
  </button>
);

export const MenuBar: React.FC<MenuBarProps> = ({
  onPreview,
  onClear,
  isFullscreen,
  onToggleFullscreen,
  activeFormats,
  onFormatToggle,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1 p-3 bg-gray-50 border-b border-gray-200">
      {/* File Operations */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
        <MenuButton onClick={onPreview} title="Preview">
          <Eye className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={onClear} title="Clear All">
          <Trash2 className="h-4 w-4" />
        </MenuButton>
      </div>

      {/* History */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
        <MenuButton onClick={onUndo} disabled={!canUndo} title="Undo">
          <Undo className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={onRedo} disabled={!canRedo} title="Redo">
          <Redo className="h-4 w-4" />
        </MenuButton>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
        <MenuButton
          onClick={() => onFormatToggle("h1")}
          isActive={activeFormats.has("h1")}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => onFormatToggle("h2")}
          isActive={activeFormats.has("h2")}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => onFormatToggle("h3")}
          isActive={activeFormats.has("h3")}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </MenuButton>
      </div>

      {/* Text Formatting */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
        <MenuButton
          onClick={() => onFormatToggle("bold")}
          isActive={activeFormats.has("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => onFormatToggle("italic")}
          isActive={activeFormats.has("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => onFormatToggle("underline")}
          isActive={activeFormats.has("underline")}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => onFormatToggle("strikethrough")}
          isActive={activeFormats.has("strikethrough")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => onFormatToggle("code")}
          isActive={activeFormats.has("code")}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </MenuButton>
      </div>

      {/* Lists and Quotes */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
        <MenuButton
          onClick={() => onFormatToggle("ul")}
          isActive={activeFormats.has("ul")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => onFormatToggle("ol")}
          isActive={activeFormats.has("ol")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => onFormatToggle("blockquote")}
          isActive={activeFormats.has("blockquote")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </MenuButton>
      </div>

      {/* Special Actions */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
        <MenuButton
          onClick={() => onFormatToggle("hr")}
          title="Horizontal Rule"
        >
          <MoreHorizontal className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={() => onFormatToggle("br")} title="Line Break">
          ↵
        </MenuButton>
      </div>

      {/* View Options */}
      <div className="flex items-center gap-1 ml-auto">
        <MenuButton
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </MenuButton>
      </div>
    </div>
  );
};
