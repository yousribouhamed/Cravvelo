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
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent the button click from affecting text selection
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseDown={(e) => {
        // Prevent mouse down from clearing selection
        e.preventDefault();
      }}
      disabled={disabled}
      title={title}
      className={`h-8 w-8 p-0 rounded-md border transition-all duration-200 flex items-center justify-center ${
        isActive ? "bg-primary  text-white " : "bg-white border text-black "
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
};

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
  isRtl = false,
}) => {
  // Enhanced format toggle with better handling
  const handleFormatToggle = (format: string) => {
    // Use setTimeout to allow the selection to be preserved
    setTimeout(() => {
      onFormatToggle(format);
    }, 0);
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-1 gap-x-4 p-3 bg-gray-50 border-b border-gray-200 ${
        isRtl ? "rtl" : "ltr"
      }`}
      onMouseDown={(e) => {
        // Prevent the entire menu bar from interfering with selection
        e.preventDefault();
      }}
    >
      {/* File Operations */}
      <div
        className={`flex items-center gap-1 pr-2 border-gray-300 ${
          isRtl ? "border-l pl-2" : "border-r pr-2"
        }`}
      >
        {onPreview && (
          <MenuButton onClick={onPreview} title="Preview">
            <Eye className="h-4 w-4" />
          </MenuButton>
        )}
        {onClear && (
          <MenuButton onClick={onClear} title="Clear All">
            <Trash2 className="h-4 w-4" />
          </MenuButton>
        )}
      </div>

      {/* History */}
      <div className={`flex items-center gap-1 pr-2 border-gray-300 `}>
        <MenuButton onClick={onUndo} disabled={!canUndo} title="Undo">
          <Undo className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={onRedo} disabled={!canRedo} title="Redo">
          <Redo className="h-4 w-4" />
        </MenuButton>
      </div>

      {/* Headings */}
      <div className={`flex items-center gap-1 pr-2 border-gray-300 `}>
        <MenuButton
          onClick={() => handleFormatToggle("h1")}
          isActive={activeFormats.has("h1")}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => handleFormatToggle("h2")}
          isActive={activeFormats.has("h2")}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => handleFormatToggle("h3")}
          isActive={activeFormats.has("h3")}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </MenuButton>
      </div>

      {/* Text Formatting */}
      <div className={`flex items-center gap-1 pr-2 border-gray-300 `}>
        <MenuButton
          onClick={() => handleFormatToggle("bold")}
          isActive={activeFormats.has("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => handleFormatToggle("italic")}
          isActive={activeFormats.has("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => handleFormatToggle("underline")}
          isActive={activeFormats.has("underline")}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => handleFormatToggle("strikethrough")}
          isActive={activeFormats.has("strikethrough")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => handleFormatToggle("code")}
          isActive={activeFormats.has("code")}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </MenuButton>
      </div>

      {/* Lists and Quotes */}
      <div className={`flex items-center gap-1 pr-2 border-gray-300 `}>
        <MenuButton
          onClick={() => handleFormatToggle("ul")}
          isActive={activeFormats.has("ul")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => handleFormatToggle("ol")}
          isActive={activeFormats.has("ol")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => handleFormatToggle("blockquote")}
          isActive={activeFormats.has("blockquote")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </MenuButton>
      </div>

      {/* Special Actions */}
      <div className={`flex items-center gap-1 pr-2 border-gray-300`}>
        <MenuButton
          onClick={() => handleFormatToggle("hr")}
          title="Horizontal Rule"
        >
          <MoreHorizontal className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={() => handleFormatToggle("br")} title="Line Break">
          ↵
        </MenuButton>
      </div>
      {/* View Options */}
      {onToggleFullscreen && (
        <div
          className={`flex items-center gap-1 ${isRtl ? "mr-auto" : "ml-auto"}`}
        >
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
      )}
    </div>
  );
};
