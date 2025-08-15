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
    <div className={`bg-gray-100 ${className}`}>
      <div className="max-w-full">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="h-6 w-6 text-blue-600" />
              <div className="text-sm text-gray-500">
                {wordCount} words • {characterCount} characters
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Download className="h-4 w-4" />
                Export
              </button>

              <button
                onClick={handlePreview}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  showPreview
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
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
