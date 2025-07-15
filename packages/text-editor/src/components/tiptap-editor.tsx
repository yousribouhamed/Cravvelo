import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import { TiptapEditorProps } from "../types";
import { MenuBar } from "./menu-bar";
import "../style/editor.css";

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  isFullscreen,
  onToggleFullscreen,
  onPreview,
  onClear,
}) => {
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
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `tiptap-editor prose prose-sm max-w-none p-6 min-h-[400px] focus:outline-none ${
          isFullscreen ? "min-h-[calc(100vh-200px)]" : ""
        }`,
      },
    },
  });

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

  return (
    <div
      className={`border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm ${
        isFullscreen ? "fixed inset-4 z-50 rounded-lg" : ""
      }`}
    >
      <MenuBar
        onPreview={onPreview}
        onClear={onClear}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
        activeFormats={activeFormats}
        onFormatToggle={(format) => {
          if (!editor) return;

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
              editor.chain().focus().toggleBold().run();
              break;
            case "italic":
              editor.chain().focus().toggleItalic().run();
              break;
            case "underline":
              editor.chain().focus().toggleUnderline().run();
              break;
            case "strikethrough":
              editor.chain().focus().toggleStrike().run();
              break;
            case "code":
              editor.chain().focus().toggleCode().run();
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
        }}
        canUndo={editor ? editor.can().undo() : false}
        canRedo={editor ? editor.can().redo() : false}
        onUndo={() => editor?.chain().focus().undo().run()}
        onRedo={() => editor?.chain().focus().redo().run()}
      />
      <EditorContent
        editor={editor}
        className="bg-white overflow-y-auto tiptap-content"
      />
    </div>
  );
};
