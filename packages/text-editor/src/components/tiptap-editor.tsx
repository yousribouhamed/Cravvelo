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

// Function to detect text direction from content
const detectTextDirection = (html: string): "ltr" | "rtl" => {
  if (!html || typeof document === "undefined") return "ltr";
  
  try {
    // Extract text content from HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    
    if (!text.trim()) return "ltr";
    
    // RTL Unicode ranges: Arabic, Hebrew, and other RTL scripts
    const rtlRanges = [
      /[\u0590-\u05FF]/, // Hebrew
      /[\u0600-\u06FF]/, // Arabic
      /[\u0700-\u074F]/, // Syriac
      /[\u0750-\u077F]/, // Arabic Supplement
      /[\u08A0-\u08FF]/, // Arabic Extended-A
      /[\uFB50-\uFDFF]/, // Arabic Presentation Forms-A
      /[\uFE70-\uFEFF]/, // Arabic Presentation Forms-B
    ];
    
    // Count RTL and LTR characters
    let rtlCount = 0;
    let ltrCount = 0;
    
    for (const char of text) {
      const isRtl = rtlRanges.some(range => range.test(char));
      
      if (isRtl) {
        rtlCount++;
      } else if (/\S/.test(char)) {
        // Count non-whitespace LTR characters
        ltrCount++;
      }
    }
    
    // If we have significant RTL content, use RTL
    // Otherwise default to LTR
    return rtlCount > ltrCount * 0.3 ? "rtl" : "ltr";
  } catch (error) {
    return "ltr";
  }
};

export const CravveloEditor: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  isFullscreen,
  onToggleFullscreen,
  onPreview,
  onClear,
  readOnly = false,
  dir,
}) => {
  // Match the app theme (Tailwind's `.dark` class) instead of OS preference.
  // This prevents `prefers-color-scheme: dark` styles from forcing light text in light mode.
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const updateThemeMode = () => {
      setThemeMode(root.classList.contains("dark") ? "dark" : "light");
    };

    updateThemeMode();

    const observer = new MutationObserver(() => {
      updateThemeMode();
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Detect direction from content, with fallback to provided dir or DOM
  const [detectedDirection, setDetectedDirection] = useState<"ltr" | "rtl">(() => {
    if (value) {
      return detectTextDirection(value);
    }
    return dir || (typeof window !== "undefined" 
      ? (document.documentElement.dir || "ltr") as "ltr" | "rtl"
      : "ltr");
  });
  
  // Use provided direction as base, but detect from content
  const baseDirection = dir || (typeof window !== "undefined" 
    ? (document.documentElement.dir || "ltr") as "ltr" | "rtl"
    : "ltr");
  
  // Detect direction from content when it changes
  useEffect(() => {
    if (value) {
      const contentDir = detectTextDirection(value);
      setDetectedDirection(contentDir);
    } else {
      setDetectedDirection(baseDirection);
    }
  }, [value, baseDirection]);
  
  // Use detected direction from content, fallback to base direction
  const textDirection = detectedDirection || baseDirection;
  const isRtl = textDirection === "rtl";

  // Safe value handling - ensure we have a valid string
  const safeValue = value || "";

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
    content: safeValue,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      if (readOnly || !onChange) return;

      try {
        const newContent = editor.getHTML();
        // Ensure we're passing a valid string
        if (typeof newContent === "string") {
          // Detect direction from new content in real-time
          const contentDir = detectTextDirection(newContent);
          setDetectedDirection(contentDir);
          
          onChange(newContent);
        }
      } catch (error) {
        console.error("Error getting editor content:", error);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Also detect direction when selection changes (as user types)
      if (readOnly) return;
      
      try {
        const currentContent = editor.getHTML();
        const contentDir = detectTextDirection(currentContent);
        setDetectedDirection(contentDir);
      } catch (error) {
        // Silently fail for selection updates
      }
    },
    editorProps: {
      attributes: {
        class: `tiptap-editor prose prose-sm dark:prose-invert max-w-none p-6 min-h-[400px] focus:outline-none bg-transparent ${
          isFullscreen ? "min-h-[calc(100vh-200px)]" : ""
        } ${readOnly ? "cursor-default" : ""}`,
        dir: textDirection,
        "data-direction": textDirection,
        "data-theme": themeMode,
      },
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && safeValue !== editor.getHTML()) {
      try {
        editor.commands.setContent(safeValue, false);
      } catch (error) {
        console.error("Error setting editor content:", error);
      }
    }
  }, [safeValue, editor]);

  // Update editor editability when readOnly prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [readOnly, editor]);

  // Set direction on editor mount and when direction changes
  useEffect(() => {
    if (editor) {
      try {
        const editorElement = editor.view.dom as HTMLElement;
        if (editorElement) {
          editorElement.dir = textDirection;
          editorElement.setAttribute("dir", textDirection);

          // Update prose direction classes
          const proseElement = editorElement.closest(".prose");
          if (proseElement) {
            if (textDirection === "rtl") {
              proseElement.classList.add("rtl");
              proseElement.classList.remove("ltr");
            } else {
              proseElement.classList.add("ltr");
              proseElement.classList.remove("rtl");
            }
          }
          
          // Also update the ProseMirror editor's direction
          const proseMirrorElement = editorElement.querySelector(".ProseMirror") as HTMLElement;
          if (proseMirrorElement) {
            proseMirrorElement.dir = textDirection;
            proseMirrorElement.setAttribute("dir", textDirection);
          }
        }
      } catch (error) {
        console.error("Error setting direction:", error);
      }
    }
  }, [editor, textDirection]);

  // Get active formats and editor state
  const activeFormats = new Set<string>();
  if (editor) {
    try {
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
    } catch (error) {
      console.error("Error checking active formats:", error);
    }
  }

  // Enhanced format toggle function with better selection handling
  const handleFormatToggle = (format: string) => {
    if (!editor || readOnly) return;

    try {
      // Store current selection
      const { from, to } = editor.state.selection;

      // If no text is selected, don't apply formatting for inline elements
      if (from === to) {
        // For block-level formats, we can still apply them
        if (
          !["h1", "h2", "h3", "ul", "ol", "blockquote", "hr", "br"].includes(
            format
          )
        ) {
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
    } catch (error) {
      console.error("Error toggling format:", error);
    }
  };

  return (
    <div
      className={`border border-border rounded-lg overflow-hidden bg-card ${
        isFullscreen ? "fixed inset-4 z-50 rounded-lg" : ""
      } ${readOnly ? "bg-muted/50" : ""}`}
      dir={textDirection}
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
          onUndo={() => {
            try {
              editor?.chain().focus().undo().run();
            } catch (error) {
              console.error("Error undoing:", error);
            }
          }}
          onRedo={() => {
            try {
              editor?.chain().focus().redo().run();
            } catch (error) {
              console.error("Error redoing:", error);
            }
          }}
        />
      )}
      <EditorContent
        editor={editor}
        className={`bg-card overflow-y-auto tiptap-content ${
          textDirection === "rtl" ? "rtl" : "ltr"
        } ${readOnly ? "bg-muted/50" : ""}`}
      />
    </div>
  );
};
