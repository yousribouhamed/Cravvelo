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

// RTL language detection utility
const isRtlCharacter = (char: string): boolean => {
  const code = char.charCodeAt(0);

  // Arabic: 0x0600-0x06FF, 0x0750-0x077F, 0x08A0-0x08FF
  // Hebrew: 0x0590-0x05FF
  // Persian/Farsi: 0xFB50-0xFDFF, 0xFE70-0xFEFF
  // Additional RTL ranges
  return (
    (code >= 0x0590 && code <= 0x05ff) || // Hebrew
    (code >= 0x0600 && code <= 0x06ff) || // Arabic
    (code >= 0x0750 && code <= 0x077f) || // Arabic Supplement
    (code >= 0x08a0 && code <= 0x08ff) || // Arabic Extended-A
    (code >= 0xfb50 && code <= 0xfdff) || // Arabic Presentation Forms-A
    (code >= 0xfe70 && code <= 0xfeff) || // Arabic Presentation Forms-B
    (code >= 0x10800 && code <= 0x1083f) || // Cypriot Syllabary
    (code >= 0x10a00 && code <= 0x10a5f) || // Kharoshthi
    (code >= 0x1ee00 && code <= 0x1eeff) // Arabic Mathematical Alphabetic Symbols
  );
};

const detectTextDirection = (text: string | any): "ltr" | "rtl" => {
  // Handle non-string input
  let textToAnalyze = "";

  if (typeof text === "string") {
    textToAnalyze = text;
  } else if (text && typeof text === "object") {
    // If it's HTML from the editor, convert to string first
    textToAnalyze = String(text);
  } else {
    // Default fallback
    textToAnalyze = "";
  }

  // Remove HTML tags and get plain text
  const plainText = textToAnalyze.replace(/<[^>]*>/g, "");

  // Find the first non-whitespace, non-punctuation character
  for (let i = 0; i < plainText.length; i++) {
    const char = plainText[i];

    // Skip whitespace and common punctuation
    if (/\s|[.,!?;:()[\]{}'"]/g.test(char)) {
      continue;
    }

    // Check if it's an RTL character
    if (isRtlCharacter(char)) {
      return "rtl";
    }

    // If we find a clear LTR character (Latin, numbers, etc.), return LTR
    if (/[a-zA-Z0-9]/.test(char)) {
      return "ltr";
    }
  }

  // Default to LTR if no clear direction is found
  return "ltr";
};

export const CravveloEditor: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  isFullscreen,
  onToggleFullscreen,
  onPreview,
  onClear,
  readOnly = false, // Add readOnly prop with default false
}) => {
  const [textDirection, setTextDirection] = useState<"ltr" | "rtl">("ltr");
  const isRtl = textDirection === "rtl";

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
    editable: !readOnly, // Set editable based on readOnly prop
    onUpdate: ({ editor }) => {
      if (readOnly) return; // Don't trigger onChange in read-only mode

      const newContent = editor.getHTML();
      onChange?.(newContent); // Use optional chaining since onChange is now optional

      // Detect text direction on content change
      const direction = detectTextDirection(newContent);
      setTextDirection(direction);
    },
    editorProps: {
      attributes: {
        class: `tiptap-editor prose prose-sm max-w-none p-6 min-h-[400px] focus:outline-none ${
          isFullscreen ? "min-h-[calc(100vh-200px)]" : ""
        } ${readOnly ? "cursor-default" : ""}`, // Add visual indication for read-only
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

  // Update editor direction when text direction changes
  useEffect(() => {
    if (editor) {
      const editorElement = editor.view.dom as HTMLElement;
      editorElement.dir = textDirection;

      // Update prose direction classes
      const proseElement = editorElement.closest(".prose");
      if (proseElement) {
        proseElement.classList.toggle("rtl", isRtl);
      }
    }
  }, [textDirection, editor, isRtl]);

  // Initial direction detection
  useEffect(() => {
    if (value) {
      const direction = detectTextDirection(value);
      setTextDirection(direction);
    }
  }, [value]);

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
    if (!editor || readOnly) return; // Prevent formatting in read-only mode

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
      className={`border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm ${
        isFullscreen ? "fixed inset-4 z-50 rounded-lg" : ""
      } ${readOnly ? "bg-gray-50" : ""}`} // Add visual indication for read-only
      dir={textDirection}
    >
      {!readOnly && ( // Only show MenuBar when not in read-only mode
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
        className={`bg-white overflow-y-auto tiptap-content ${
          isRtl ? "rtl" : "ltr"
        } ${readOnly ? "bg-gray-50" : ""}`} // Add visual indication for read-only
      />
    </div>
  );
};
