"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Play, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChapterType } from "../types";

interface CourseNavigatorProps {
  chapters: ChapterType[];
  courseId: string;
  className?: string;
}

export const CourseNavigator: React.FC<CourseNavigatorProps> = ({
  chapters,
  courseId,
  className = "",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentChapterId = searchParams.get("chapter");
  const currentModuleId = searchParams.get("module");

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
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "w-full max-w-md bg-background border rounded-lg",
        "rtl:text-right",
        className
      )}
      dir="rtl"
    >
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">محتوى الدورة</h3>
        <p className="text-sm text-muted-foreground">
          {parsedChapters.length} فصول
        </p>
      </div>

      <div className="max-h-[600px] overflow-y-auto p-2">
        <Accordion
          type="multiple"
          defaultValue={currentChapterId ? [currentChapterId] : []}
          className="space-y-3"
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
                className="border rounded-lg bg-card"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 rounded-t-lg [&[data-state=open]]:border-b">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="text-right">
                      <p className="font-medium text-sm">{chapter.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {modules.length}{" "}
                        {modules.length === 1 ? "وحدة" : "وحدات"}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pb-0">
                  <div className="bg-muted/25">
                    {/* @ts-expect-error */}
                    {modules.map((module, index) => {
                      const isCurrentModule = currentModuleId === module.id;
                      const isVideo = module.type === "VIDEO";

                      return (
                        <button
                          key={module.id}
                          onClick={() =>
                            navigateToModule(chapter.id, module.id)
                          }
                          className={cn(
                            "w-full flex items-center space-x-3 space-x-reverse p-3 pr-8 hover:bg-muted/75 transition-colors text-right",
                            isCurrentModule &&
                              "bg-primary/10 border-l-2 border-primary",
                            index === modules.length - 1 && "rounded-b-lg"
                          )}
                        >
                          <div className="flex-shrink-0">
                            {isVideo ? (
                              <Play className="h-4 w-4 text-primary scale-x-[-1]" />
                            ) : module.isFree ? (
                              <div className="h-4 w-4 rounded border border-muted-foreground/50" />
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-sm font-medium truncate text-right",
                                isCurrentModule && "text-primary"
                              )}
                            >
                              {module.title}
                            </p>
                            <div className="flex items-center justify-end space-x-2 space-x-reverse text-xs text-muted-foreground">
                              <span>{formatDuration(module.duration)}</span>
                            </div>
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
