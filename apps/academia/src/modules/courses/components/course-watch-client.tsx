"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { VideoPlayer } from "./video-player";
import { CourseNavigator } from "./course-navigator";
import { CourseControls } from "./course-controls";
import { Menu, X } from "lucide-react";
import { ChapterType, Course } from "../types";

interface CourseWatchClientProps {
  course: Course & { Chapter: ChapterType[] };
}

export const CourseWatchClient: React.FC<CourseWatchClientProps> = ({
  course,
}) => {
  const searchParams = useSearchParams();
  const currentChapterId = searchParams.get("chapter");
  const currentModuleId = searchParams.get("module");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Parse chapters and modules
  const chapters: ChapterType[] = course.Chapter.map((chapter: any) => ({
    ...chapter,
    modules:
      typeof chapter.modules === "string"
        ? JSON.parse(chapter.modules)
        : chapter.modules,
  }));

  // Auto-select first module if none selected
  useEffect(() => {
    if (!currentChapterId || !currentModuleId) {
      const firstChapter = chapters.find((c) => c.isVisible);
      if (firstChapter && firstChapter.modules.length > 0) {
        const firstModule = firstChapter.modules.sort(
          (a, b) => a.orderNumber - b.orderNumber
        )[0];
        if (firstModule) {
          const params = new URLSearchParams();
          params.set("chapter", firstChapter.id);
          params.set("module", firstModule.id);
          window.history.replaceState(null, "", `?${params.toString()}`);
        }
      }
    }
  }, [chapters, currentChapterId, currentModuleId]);

  // Get current module
  const getCurrentModule = () => {
    if (!currentChapterId || !currentModuleId) return null;

    const chapter = chapters.find((c) => c.id === currentChapterId);
    if (!chapter) return null;

    const module = chapter.modules.find((m) => m.id === currentModuleId);
    return module || null;
  };

  const currentModule = getCurrentModule();

  return (
    <div className="min-h-screen py-8">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <h1 className="text-lg font-semibold truncate">{course.title}</h1>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-muted rounded-md"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex gap-x-8">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-80 min-h-screen border-r bg-background">
          <CourseNavigator chapters={chapters} courseId={course.id} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="w-80 bg-background border-r shadow-lg">
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold mb-1">{course.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    {course.level} • {course.sound}
                  </p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-muted rounded-md"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <CourseNavigator chapters={chapters} courseId={course.id} />
            </div>
            <div
              className="flex-1 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <div className="max-w-6xl mx-auto p-4 lg:p-6">
            {/* Video Player */}
            {currentModule ? (
              <div className="space-y-6">
                <VideoPlayer
                  videoId={currentModule.fileUrl}
                  title={currentModule.title}
                  height={400}
                  className="shadow-lg"
                />

                {/* Module Info */}
                <div className="bg-background border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-2">
                    {currentModule.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <span>
                      {Math.floor(currentModule.duration / 60)}:
                      {(currentModule.duration % 60)
                        .toString()
                        .padStart(2, "0")}
                    </span>
                    <span>{currentModule.type}</span>
                  </div>

                  {/* Module Content */}
                  {currentModule.content && currentModule.content !== "{}" && (
                    <div className="prose prose-sm max-w-none">
                      {/* You can parse and display the content here if needed */}
                      <p>Module content goes here...</p>
                    </div>
                  )}
                </div>

                {/* Navigation Controls */}
                <CourseControls chapters={chapters} />
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">
                    No module selected
                  </h2>
                  <p className="text-muted-foreground">
                    Select a module from the sidebar to start learning
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
