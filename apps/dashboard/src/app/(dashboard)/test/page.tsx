"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useForm, Controller } from "react-hook-form";
import { Button } from "ui/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  FileText,
  Settings,
  Users,
  MessageSquare,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

// Menu Button Component
const MenuButton = ({
  onClick,
  isActive = false,
  children,
  disabled = false,
}) => (
  <Button
    type="button"
    variant={isActive ? "default" : "outline"}
    size="sm"
    onClick={onClick}
    disabled={disabled}
    className="h-8 w-8 p-0"
  >
    {children}
  </Button>
);

// Menu Bar Component
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div
      className="flex flex-wrap gap-1 p-2 border-b border-gray-200"
      dir="ltr"
    >
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </MenuButton>

      <div className="w-px bg-gray-300 mx-1" />

      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
      >
        <List className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
      >
        <ListOrdered className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
      >
        <Quote className="h-4 w-4" />
      </MenuButton>

      <div className="w-px bg-gray-300 mx-1" />

      <MenuButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo className="h-4 w-4" />
      </MenuButton>
    </div>
  );
};

// Tiptap Editor Component
const TiptapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none",
        dir: "rtl",
      },
    },
  });

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

// Main Component
const ArabicEditorTest = () => {
  const [currentScenario, setCurrentScenario] = useState("blog");
  const [testResults, setTestResults] = useState({});

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      content: "<p>ابدأ بكتابة المحتوى هنا...</p>",
    },
  });

  const content = watch("content");

  const testScenarios = [
    {
      id: "blog",
      title: "مقال المدونة",
      description: "اختبار إنشاء وتحرير محتوى المدونة",
      icon: <FileText className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      id: "documentation",
      title: "التوثيق",
      description: "اختبار تنسيق التوثيق التقني",
      icon: <Settings className="h-5 w-5" />,
      color: "bg-green-500",
    },
    {
      id: "newsletter",
      title: "النشرة الإخبارية",
      description: "اختبار إنشاء محتوى النشرة الإخبارية",
      icon: <Users className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      id: "announcement",
      title: "الإعلان",
      description: "اختبار تنسيق إعلان الشركة",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "bg-orange-500",
    },
    {
      id: "meeting",
      title: "ملاحظات الاجتماع",
      description: "اختبار ملاحظات الاجتماع وعناصر العمل",
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-indigo-500",
    },
  ];

  const markTestComplete = (scenarioId) => {
    setTestResults((prev) => ({
      ...prev,
      [scenarioId]: true,
    }));
  };

  const resetTests = () => {
    setTestResults({});
  };

  const getScenarioStatus = (scenarioId) => {
    if (testResults[scenarioId]) return "complete";
    if (scenarioId === currentScenario) return "current";
    return "pending";
  };

  const completedCount = Object.values(testResults).filter(Boolean).length;
  const totalCount = testScenarios.length;

  const onSubmit = (data) => {
    console.log("تم إرسال النموذج:", data);
  };

  const handlePreview = () => {
    console.log("المحتوى الحالي:", content);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                مجموعة اختبار محرر النصوص المتقدم
              </h1>
              <p className="mt-2 text-gray-600">
                اختبر مكون المحرر عبر حالات استخدام مختلفة
              </p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="text-sm text-gray-500">
                التقدم: {completedCount}/{totalCount} سيناريو
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
              <Button onClick={resetTests} variant="outline" size="sm">
                إعادة تعيين الاختبارات
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Test Scenarios */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">
                سيناريوهات الاختبار
              </h2>
              <div className="space-y-3">
                {testScenarios.map((scenario) => {
                  const status = getScenarioStatus(scenario.id);
                  return (
                    <button
                      key={scenario.id}
                      onClick={() => setCurrentScenario(scenario.id)}
                      className={`w-full text-right p-3 rounded-lg transition-all duration-200 ${
                        status === "current"
                          ? "bg-blue-50 border-2 border-blue-200"
                          : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div
                          className={`${scenario.color} text-white p-2 rounded-lg`}
                        >
                          {scenario.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <h3 className="font-medium text-gray-900 truncate">
                              {scenario.title}
                            </h3>
                            {status === "complete" && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {status === "current" && (
                              <AlertCircle className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {scenario.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Test Instructions */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2 space-x-reverse">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">
                      تعليمات الاختبار
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      لكل سيناريو، جرب استخدام جميع خيارات التنسيق: غامق، مائل،
                      قوائم، اقتباسات، ووظائف التراجع/الإعادة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Current Scenario Header */}
              <div className="border-b bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    {testScenarios.find((s) => s.id === currentScenario) && (
                      <>
                        <div
                          className={`${
                            testScenarios.find((s) => s.id === currentScenario)
                              ?.color
                          } text-white p-2 rounded-lg`}
                        >
                          {
                            testScenarios.find((s) => s.id === currentScenario)
                              ?.icon
                          }
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold">
                            {
                              testScenarios.find(
                                (s) => s.id === currentScenario
                              )?.title
                            }
                          </h2>
                          <p className="text-gray-600">
                            {
                              testScenarios.find(
                                (s) => s.id === currentScenario
                              )?.description
                            }
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={() => markTestComplete(currentScenario)}
                    disabled={testResults[currentScenario]}
                    variant={
                      testResults[currentScenario] ? "outline" : "default"
                    }
                  >
                    {testResults[currentScenario] ? (
                      <>
                        <CheckCircle className="h-4 w-4 ml-2" />
                        مكتمل
                      </>
                    ) : (
                      "وضع علامة مكتمل"
                    )}
                  </Button>
                </div>
              </div>

              {/* Editor Component */}
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      المحتوى
                    </label>
                    <Controller
                      name="content"
                      control={control}
                      render={({ field }) => (
                        <TiptapEditor
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleSubmit(onSubmit)}>
                      حفظ المحتوى
                    </Button>
                    <Button variant="outline" onClick={handlePreview}>
                      معاينة المحتوى
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Checklist */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">
                قائمة مراجعة الاختبار
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "تنسيق النص الغامق",
                  "تنسيق النص المائل",
                  "القوائم النقطية",
                  "القوائم المرقمة",
                  "الاقتباسات",
                  "وظيفة التراجع",
                  "وظيفة الإعادة",
                  "إرسال النموذج",
                  "معاينة المحتوى",
                  "عرض مخرجات HTML",
                ].map((item, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-3 space-x-reverse cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* HTML Output Display */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">مخرجات HTML:</h3>
              <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {content}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArabicEditorTest;
