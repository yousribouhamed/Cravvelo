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
import { useTranslations, useLocale } from "next-intl";

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
        isRTL ? "text-right" : "text-left",
        className
      )}
      dir={dir}
    >
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">{t("courseContent")}</h3>
        <p className="text-sm text-muted-foreground">
          {parsedChapters.length} {parsedChapters.length === 1 ? t("chapter") : t("chapters")}
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
                  <div className={cn(
                    "flex items-center",
                    isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                  )}>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className="font-medium text-sm">{chapter.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {modules.length}{" "}
                        {modules.length === 1 ? t("module") : t("modules")}
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
                            "w-full flex items-center p-3 hover:bg-muted/75 transition-colors",
                            isRTL ? "space-x-reverse space-x-3 pr-8 text-right" : "space-x-3 pl-8 text-left",
                            isCurrentModule &&
                              (isRTL ? "bg-primary/10 border-r-2 border-primary" : "bg-primary/10 border-l-2 border-primary"),
                            index === modules.length - 1 && "rounded-b-lg"
                          )}
                        >
                          <div className="flex-shrink-0">
                            {isVideo ? (
                              <Play className={cn(
                                "h-4 w-4 text-primary",
                                isRTL && "scale-x-[-1]"
                              )} />
                            ) : module.isFree ? (
                              <div className="h-4 w-4 rounded border border-muted-foreground/50" />
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-sm font-medium truncate",
                                isRTL ? "text-right" : "text-left",
                                isCurrentModule && "text-primary"
                              )}
                            >
                              {module.title}
                            </p>
                            <div className={cn(
                              "flex items-center text-xs text-muted-foreground",
                              isRTL ? "justify-end space-x-reverse space-x-2" : "justify-start space-x-2"
                            )}>
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
