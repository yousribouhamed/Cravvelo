import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Save, Eye, FileText, Download } from "lucide-react";
import { TiptapEditor } from "./components/tiptap-editor";

interface FormData {
  title: string;
  content: string;
}

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
                    onToggleFullscreen={toggleFullscreen}
                    onPreview={handlePreview}
                    onClear={handleClear}
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
