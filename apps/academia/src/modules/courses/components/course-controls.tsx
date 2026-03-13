"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChapterType, ModuleType } from "../types";
import { useTranslations, useLocale } from "next-intl";

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
  const t = useTranslations("watch");
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Chapters/modules are normalized by parent; only flatten them here.
  const allModules = React.useMemo(() => {
    const modulesList: Array<{
      module: ModuleType;
      chapter: ChapterType;
      index: number;
    }> = [];

    chapters.forEach((chapter) => {
      const sortedModules = [...chapter.modules].sort(
        (a, b) => (a.orderNumber || 0) - (b.orderNumber || 0)
      );
      sortedModules.forEach((module) => {
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
    router.replace(`?${params.toString()}`);
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
        "flex items-center justify-between gap-3 border-t border-border bg-background px-3 py-2 sm:px-4 sm:py-2.5 rounded-b-md",
        className
      )}
    >
      <button
        type="button"
        onClick={goToPrevious}
        disabled={!canGoPrevious}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 text-sm font-medium min-h-[40px] touch-manipulation border border-border rounded-md transition-colors",
          isRTL ? "flex-row-reverse" : "",
          canGoPrevious
            ? "text-primary hover:bg-primary/10 border-primary/50"
            : "text-muted-foreground cursor-not-allowed opacity-60"
        )}
      >
        {isRTL ? <ChevronRight className="h-4 w-4 shrink-0" /> : <ChevronLeft className="h-4 w-4 shrink-0" />}
        <span className="hidden sm:inline">{t("previous")}</span>
      </button>

      {currentInfo && (
        <div className="flex-1 min-w-0 text-center px-2">
          <p className="text-sm font-medium truncate text-foreground">
            {currentInfo.module.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentModuleIndex + 1} / {allModules.length}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={goToNext}
        disabled={!canGoNext}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 text-sm font-medium min-h-[40px] touch-manipulation border border-border rounded-md transition-colors",
          isRTL ? "flex-row-reverse" : "",
          canGoNext
            ? "text-primary hover:bg-primary/10 border-primary/50"
            : "text-muted-foreground cursor-not-allowed opacity-60"
        )}
      >
        <span className="hidden sm:inline">{t("next")}</span>
        {isRTL ? <ChevronLeft className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
      </button>
    </div>
  );
};
