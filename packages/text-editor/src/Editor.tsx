import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Link,
  Save,
  Eye,
  FileText,
  Download,
  Upload,
  Trash2,
  Copy,
  Scissors,
  ClipboardPaste,
  Search,
  MoreHorizontal,
  Palette,
  Type,
  Minimize2,
  Maximize2,
} from "lucide-react";

interface MenuButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  title?: string;
}

interface MenuBarProps {
  onSave: () => void;
  onPreview: () => void;
  onClear: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  activeFormats: Set<string>;
  onFormatToggle: (format: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  isFullscreen: boolean;
}

interface FormData {
  content: string;
  title: string;
}

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

const MenuBar: React.FC<MenuBarProps> = ({
  onSave,
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
        <MenuButton onClick={onSave} title="Save Document">
          <Save className="h-4 w-4" />
        </MenuButton>
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

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  isFullscreen,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none p-6 min-h-[400px] focus:outline-none ${
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
        onSave={() => {}}
        onPreview={() => {}}
        onClear={() => editor?.commands.setContent("<p></p>")}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => {}}
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
      <EditorContent editor={editor} className="bg-white overflow-y-auto" />
    </div>
  );
};

const ProfessionalTextEditor: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  const { control, handleSubmit, watch, setValue, getValues } =
    useForm<FormData>({
      defaultValues: {
        title: "Untitled Document",
        content: "<p>Start writing your professional document here...</p>",
      },
    });

  const content = watch("content");
  const title = watch("title");

  // Calculate word and character count
  React.useEffect(() => {
    const textContent = content.replace(/<[^>]*>/g, "");
    const words = textContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
    setCharacterCount(textContent.length);
  }, [content]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Document saved:", data);
    // Handle save logic here
    alert("Document saved successfully!");
  };

  const handlePreview = (): void => {
    setShowPreview(!showPreview);
  };

  const handleClear = (): void => {
    if (confirm("Are you sure you want to clear all content?")) {
      setValue("content", "<p></p>");
      setValue("title", "Untitled Document");
    }
  };

  const handleExport = (): void => {
    const data = getValues();
    const blob = new Blob([data.content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.title}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setValue("title", e.target.value)}
                  className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900"
                  placeholder="Document Title"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {wordCount} words • {characterCount} characters
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export
              </button>

              <button
                onClick={handlePreview}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showPreview
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Eye className="h-4 w-4" />
                {showPreview ? "Edit" : "Preview"}
              </button>

              <button
                onClick={handleSubmit(onSubmit)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {showPreview ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h1 className="text-3xl font-bold mb-6 text-gray-900">{title}</h1>
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TiptapEditor
                    value={field.value}
                    onChange={field.onChange}
                    isFullscreen={isFullscreen}
                  />
                )}
              />
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-white border-t border-gray-200 px-6 py-2">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-6">
              <span>Ready</span>
              <span>Line 1, Column 1</span>
            </div>
            <div className="flex items-center gap-6">
              <span>UTF-8</span>
              <span>Auto-saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTextEditor;
