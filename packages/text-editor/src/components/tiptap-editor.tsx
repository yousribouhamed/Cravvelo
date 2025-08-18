"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import { TiptapEditorProps } from "../types";
import { MenuBar } from "./menu-bar";
import "../style/editor.css";

export const CravveloEditor: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  isFullscreen,
  onToggleFullscreen,
  onPreview,
  onClear,
  readOnly = false,
}) => {
  // Force RTL direction (Arabic)
  const textDirection = "rtl";
  const isRtl = true;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable the default list extensions since we're adding them separately
        bulletList: false,
        orderedList: false,
        listItem: false,
        // Keep heading enabled in StarterKit
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      ListItem.configure({
        HTMLAttributes: {
          class: "tiptap-list-item",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "tiptap-bullet-list",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "tiptap-ordered-list",
        },
      }),
    ],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      if (readOnly) return;

      const newContent = editor.getHTML();
      onChange?.(newContent);
    },
    editorProps: {
      attributes: {
        class: `tiptap-editor prose prose-sm dark:prose-invert max-w-none p-6 min-h-[400px] focus:outline-none bg-transparent ${
          isFullscreen ? "min-h-[calc(100vh-200px)]" : ""
        } ${readOnly ? "cursor-default" : ""}`,
        dir: textDirection,
      },
    },
  });

  // Update editor editability when readOnly prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [readOnly, editor]);

  // Set RTL direction on editor mount
  useEffect(() => {
    if (editor) {
      const editorElement = editor.view.dom as HTMLElement;
      editorElement.dir = "rtl";

      // Update prose direction classes
      const proseElement = editorElement.closest(".prose");
      if (proseElement) {
        proseElement.classList.add("rtl");
      }
    }
  }, [editor]);

  // Get active formats and editor state
  const activeFormats = new Set<string>();
  if (editor) {
    if (editor.isActive("heading", { level: 1 })) activeFormats.add("h1");
    if (editor.isActive("heading", { level: 2 })) activeFormats.add("h2");
    if (editor.isActive("heading", { level: 3 })) activeFormats.add("h3");
    if (editor.isActive("bold")) activeFormats.add("bold");
    if (editor.isActive("italic")) activeFormats.add("italic");
    if (editor.isActive("underline")) activeFormats.add("underline");
    if (editor.isActive("strike")) activeFormats.add("strikethrough");
    if (editor.isActive("code")) activeFormats.add("code");
    if (editor.isActive("bulletList")) activeFormats.add("ul");
    if (editor.isActive("orderedList")) activeFormats.add("ol");
    if (editor.isActive("blockquote")) activeFormats.add("blockquote");
  }

  // Enhanced format toggle function with better selection handling
  const handleFormatToggle = (format: string) => {
    if (!editor || readOnly) return;

    // Store current selection
    const { from, to } = editor.state.selection;

    // If no text is selected, don't apply formatting
    if (from === to) {
      // For block-level formats, we can still apply them
      if (
        ["h1", "h2", "h3", "ul", "ol", "blockquote", "hr", "br"].includes(
          format
        )
      ) {
        // Apply block formatting
      } else {
        // For inline formats, just focus and return
        editor.chain().focus().run();
        return;
      }
    }

    // Apply formatting based on type
    switch (format) {
      case "h1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "h2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "h3":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "bold":
        if (from !== to) {
          editor.chain().focus().toggleBold().run();
        }
        break;
      case "italic":
        if (from !== to) {
          editor.chain().focus().toggleItalic().run();
        }
        break;
      case "underline":
        if (from !== to) {
          editor.chain().focus().toggleUnderline().run();
        }
        break;
      case "strikethrough":
        if (from !== to) {
          editor.chain().focus().toggleStrike().run();
        }
        break;
      case "code":
        if (from !== to) {
          editor.chain().focus().toggleCode().run();
        }
        break;
      case "ul":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "ol":
        editor.chain().focus().toggleOrderedList().run();
        break;
      case "blockquote":
        editor.chain().focus().toggleBlockquote().run();
        break;
      case "hr":
        editor.chain().focus().setHorizontalRule().run();
        break;
      case "br":
        editor.chain().focus().setHardBreak().run();
        break;
    }
  };

  return (
    <div
      className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-transparent ${
        isFullscreen ? "fixed inset-4 z-50 rounded-lg" : ""
      } ${readOnly ? "bg-gray-50/50 dark:!bg-[#0A0A0C]" : ""}`}
      dir="rtl"
    >
      {!readOnly && (
        <MenuBar
          onPreview={onPreview}
          onClear={onClear}
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
          activeFormats={activeFormats}
          isRtl={isRtl}
          onFormatToggle={handleFormatToggle}
          canUndo={editor ? editor.can().undo() : false}
          canRedo={editor ? editor.can().redo() : false}
          onUndo={() => editor?.chain().focus().undo().run()}
          onRedo={() => editor?.chain().focus().redo().run()}
        />
      )}
      <EditorContent
        editor={editor}
        className={`bg-transparent dark:!bg-[#0A0A0C] overflow-y-auto tiptap-content rtl ${
          readOnly ? "bg-gray-50/50 dark:!bg-[#0A0A0C]" : ""
        }`}
      />
    </div>
  );
};
