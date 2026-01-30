import React, { useState, useEffect } from "react";

import { Eye, FileText, Download } from "lucide-react";
import { CravveloEditor as TiptapEditor } from "./components/tiptap-editor";

interface CravveloEditorProps {
  initialValue?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const CravveloEditor: React.FC<CravveloEditorProps> = ({
  initialValue = "<p>Start writing your content here...</p>",
  onChange,
  placeholder = "Start writing your content here...",
  className = "",
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [content, setContent] = useState(initialValue);
  const [direction, setDirection] = useState<"ltr" | "rtl">(() => {
    if (typeof window !== "undefined") {
      return (document.documentElement.dir || "ltr") as "ltr" | "rtl";
    }
    return "ltr";
  });

  // Calculate word and character count
  useEffect(() => {
    const textContent = content.replace(/<[^>]*>/g, "");
    const words = textContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
    setCharacterCount(textContent.length);
  }, [content]);

  // Detect direction changes from DOM
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDirection = () => {
        const dir = (document.documentElement.dir || "ltr") as "ltr" | "rtl";
        setDirection(dir);
      };

      // Initial check
      updateDirection();

      // Watch for direction changes
      const observer = new MutationObserver(() => {
        updateDirection();
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["dir"],
      });

      return () => observer.disconnect();
    }
  }, []);

  // Handle content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onChange?.(newContent);
  };

  const handlePreview = (): void => {
    setShowPreview(!showPreview);
  };

  const handleClear = (): void => {
    if (confirm("Are you sure you want to clear all content?")) {
      const emptyContent = "<p></p>";
      setContent(emptyContent);
      onChange?.(emptyContent);
    }
  };

  const handleExport = (): void => {
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`bg-card ${className}`}>
      <div className="max-w-full">
        {/* Header */}
        <div className="bg-card shadow-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="h-6 w-6 text-foreground dark:text-primary" />
              <div className="text-sm text-muted-foreground">
                {wordCount} words • {characterCount} characters
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm"
              >
                <Download className="h-4 w-4" />
                Export
              </button>

              <button
                onClick={handlePreview}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  showPreview
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                <Eye className="h-4 w-4" />
                {showPreview ? "Edit" : "Preview"}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {showPreview ? (
            <div className="bg-card rounded-lg shadow-sm border border-border p-8">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <TiptapEditor
                value={content}
                onChange={handleContentChange}
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
                onPreview={handlePreview}
                onClear={handleClear}
                dir={direction}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CravveloEditor;

// Example usage in a form:
/*
import React from "react";
import { useForm, Controller } from "react-hook-form";
import CravveloEditor from "./CravveloEditor";

interface FormData {
  title: string;
  content: string;
  description: string;
}

const MyForm: React.FC = () => {
  const { control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      title: "",
      content: "<p>Initial content here...</p>",
      description: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter title"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <CravveloEditor
              initialValue={field.value}
              onChange={field.onChange}
              placeholder="Start writing your content here..."
              className="min-h-[400px]"
            />
          )}
        />
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Submit Form
      </button>
    </form>
  );
};
*/
