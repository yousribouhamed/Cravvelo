"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Play, Lock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChapterType } from "../types";
import { useTranslations, useLocale } from "next-intl";

interface CourseNavigatorProps {
  chapters: ChapterType[];
  courseId: string;
  className?: string;
  /** Called when a module is selected (e.g. to close mobile sidebar) */
  onModuleSelect?: () => void;
}

export const CourseNavigator: React.FC<CourseNavigatorProps> = ({
  chapters,
  className = "",
  onModuleSelect,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentChapterId = searchParams.get("chapter");
  const currentModuleId = searchParams.get("module");
  const t = useTranslations("watch");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const isRTL = locale === "ar";

  // Parse modules from JSON strings and sort chapters
  const parsedChapters = React.useMemo(() => {
    return chapters
      .map((chapter) => ({
        ...chapter,
        modules:
          typeof chapter.modules === "string"
            ? JSON.parse(chapter.modules)
            : chapter.modules,
      }))
      .sort((a, b) => a.orderNumber - b.orderNumber);
  }, [chapters]);

  const navigateToModule = (chapterId: string, moduleId: string) => {
    const params = new URLSearchParams();
    params.set("chapter", chapterId);
    params.set("module", moduleId);
    router.replace(`?${params.toString()}`);
    onModuleSelect?.();
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-md border border-border bg-card overflow-hidden",
        isRTL ? "text-right" : "text-left",
        className
      )}
      dir={dir}
    >
      {/* Header */}
      <div className="rounded-t-md px-4 py-3 border-b border-border bg-muted/30">
        <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/20 text-primary">
            <BookOpen className="h-4 w-4 text-current" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground">{t("courseContent")}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {parsedChapters.length} {parsedChapters.length === 1 ? t("chapter") : t("chapters")}
            </p>
          </div>
        </div>
      </div>

      {/* Chapters list */}
      <div className="max-h-[calc(100vh-220px)] min-h-[200px] overflow-y-auto p-2">
        <Accordion
          type="multiple"
          defaultValue={currentChapterId ? [currentChapterId] : []}
          className="space-y-1.5"
        >
          {parsedChapters.map((chapter) => {
            const modules = chapter.modules.sort(
              //@ts-expect-error
              (a, b) => a.orderNumber - b.orderNumber
            );

            return (
              <AccordionItem
                key={chapter.id}
                value={chapter.id}
                className="rounded-md border border-border bg-background overflow-hidden data-[state=open]:border-border"
              >
                <AccordionTrigger className="rounded-t-md px-3 py-2.5 hover:bg-muted/40 data-[state=open]:border-b border-transparent data-[state=open]:border-border [&>svg]:shrink-0">
                  <div className={cn(
                    "flex items-center w-full min-w-0",
                    isRTL && "flex-row-reverse"
                  )}>
                    <div className={cn("flex-1 min-w-0", isRTL ? "text-right" : "text-left")}>
                      <p className="font-medium text-sm text-foreground">{chapter.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {modules.length} {modules.length === 1 ? t("module") : t("modules")}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pb-0 pt-0">
                  <div className="rounded-b-md bg-muted/20 overflow-hidden">
                    {/* @ts-expect-error */}
                    {modules.map((module) => {
                      const isCurrentModule = currentModuleId === module.id;
                      const isLocked = !module.isFree;

                      return (
                        <button
                          key={module.id}
                          type="button"
                          onClick={() => navigateToModule(chapter.id, module.id)}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-muted/50 min-h-[44px]",
                            isRTL && "text-right flex-row-reverse",
                            isCurrentModule &&
                              (isRTL
                                ? "bg-primary/10 border-r-2 border-primary"
                                : "bg-primary/10 border-l-2 border-primary")
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-sm",
                              isCurrentModule
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/80 text-muted-foreground"
                            )}
                          >
                            {isLocked ? (
                              <Lock className={cn("h-3.5 w-3.5 text-current", isRTL && "scale-x-[-1]")} />
                            ) : (
                              <Play className={cn("h-3.5 w-3.5 text-current", isRTL && "scale-x-[-1]")} />
                            )}
                          </div>

                          <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
                            <p
                              className={cn(
                                "text-sm font-medium truncate",
                                isCurrentModule && "text-primary"
                              )}
                            >
                              {module.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatDuration(module.duration)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};
