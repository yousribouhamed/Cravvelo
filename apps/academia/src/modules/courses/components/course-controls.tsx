"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChapterType, ModuleType } from "../types";

interface CourseControlsProps {
  chapters: ChapterType[];
  className?: string;
}

export const CourseControls: React.FC<CourseControlsProps> = ({
  chapters,
  className = "",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentChapterId = searchParams.get("chapter");
  const currentModuleId = searchParams.get("module");

  // Parse modules from JSON strings and create flat list
  const allModules = React.useMemo(() => {
    const parsedChapters = chapters
      .map((chapter) => ({
        ...chapter,
        modules:
          typeof chapter.modules === "string"
            ? JSON.parse(chapter.modules)
            : chapter.modules,
      }))
      .sort((a, b) => a.orderNumber - b.orderNumber);

    const modulesList: Array<{
      module: ModuleType;
      chapter: ChapterType;
      index: number;
    }> = [];

    parsedChapters.forEach((chapter) => {
      const sortedModules = chapter.modules.sort(
        //@ts-expect-error
        (a, b) => a.orderNumber - b.orderNumber
      );
      //@ts-expect-error
      sortedModules.forEach((module, moduleIndex) => {
        modulesList.push({
          module,
          chapter,
          index: modulesList.length,
        });
      });
    });

    return modulesList;
  }, [chapters]);

  const currentModuleIndex = allModules.findIndex(
    (item) =>
      item.module.id === currentModuleId && item.chapter.id === currentChapterId
  );

  const canGoPrevious = currentModuleIndex > 0;
  const canGoNext = currentModuleIndex < allModules.length - 1;

  const navigateToModule = (chapterId: string, moduleId: string) => {
    const params = new URLSearchParams();
    params.set("chapter", chapterId);
    params.set("module", moduleId);
    router.push(`?${params.toString()}`);
  };

  const goToPrevious = () => {
    if (canGoPrevious) {
      const prevItem = allModules[currentModuleIndex - 1];
      navigateToModule(prevItem.chapter.id, prevItem.module.id);
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      const nextItem = allModules[currentModuleIndex + 1];
      navigateToModule(nextItem.chapter.id, nextItem.module.id);
    }
  };

  const getCurrentModuleInfo = () => {
    if (currentModuleIndex >= 0) {
      return allModules[currentModuleIndex];
    }
    return null;
  };

  const currentInfo = getCurrentModuleInfo();

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 bg-background border rounded-lg",
        className
      )}
    >
      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        disabled={!canGoPrevious}
        className={cn(
          "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors",
          canGoPrevious
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Current Module Info */}
      {currentInfo && (
        <div className="flex-1 text-center px-4">
          <p className="text-sm font-medium truncate">
            {currentInfo.module.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentModuleIndex + 1} of {allModules.length} modules
          </p>
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={goToNext}
        disabled={!canGoNext}
        className={cn(
          "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors",
          canGoNext
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
