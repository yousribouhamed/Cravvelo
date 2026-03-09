"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VideoPlayer } from "./video-player";
import { CourseNavigator } from "./course-navigator";
import { CourseControls } from "./course-controls";
import { Menu, X } from "lucide-react";
import { ChapterType, Course } from "../types";
import { useTranslations } from "next-intl";

const ALLOWED_HTML_TAGS =
  /^(p|br|strong|em|b|i|u|h1|h2|h3|h4|h5|h6|ul|ol|li|a|span|div|hr|blockquote|pre|code|sub|sup)$/i;

/** Sanitize HTML: allow only safe tags and strip script/event handlers to prevent XSS */
function sanitizeModuleHtml(html: string): string {
  if (typeof html !== "string") return "";
  let s = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "")
    .replace(/\s*href\s*=\s*["']\s*javascript:[^"']*["']/gi, ' href="#"');
  const fragment = s.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tagName) => {
    const lower = (tagName || "").toLowerCase();
    if (!ALLOWED_HTML_TAGS.test(lower)) return "";
    return lower === "a" || lower === "br" || lower === "hr" ? match.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "") : match;
  });
  return fragment;
}

/** Safely render module content: JSON with HTML, raw HTML (TipTap), or plain text */
function ModuleContent({ content }: { content: string }) {
  const extractHtml = (raw: string): string | null => {
    if (!raw || raw === "{}") return null;
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (typeof parsed === "string") return parsed;
      if (parsed && typeof parsed === "object") {
        const text =
          "content" in parsed && typeof (parsed as { content?: string }).content === "string"
            ? (parsed as { content: string }).content
            : "text" in parsed && typeof (parsed as { text?: string }).text === "string"
              ? (parsed as { text: string }).text
              : "body" in parsed && typeof (parsed as { body?: string }).body === "string"
                ? (parsed as { body: string }).body
                : "html" in parsed && typeof (parsed as { html?: string }).html === "string"
                  ? (parsed as { html: string }).html
                  : null;
        return text ?? null;
      }
    } catch {
      return raw;
    }
    return null;
  };

  const raw = extractHtml(content);
  if (raw == null) return null;

  const looksLikeHtml = /<[a-z][a-z0-9]*\b[^>]*>|<\/[a-z][a-z0-9]*>/i.test(raw);
  if (looksLikeHtml) {
    const sanitized = sanitizeModuleHtml(raw);
    return (
      <div
        className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-headings:font-semibold"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <p className="whitespace-pre-wrap">{raw}</p>
    </div>
  );
}

interface CourseWatchClientProps {
  course: Course & { Chapter: ChapterType[] };
}

export const CourseWatchClient: React.FC<CourseWatchClientProps> = ({
  course,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentChapterId = searchParams.get("chapter");
  const currentModuleId = searchParams.get("module");
  const t = useTranslations("watch");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chapters: ChapterType[] = useMemo(
    () =>
      course.Chapter.map((chapter: any) => ({
        ...chapter,
        modules:
          chapter.modules === null || chapter.modules === undefined
            ? []
            : typeof chapter.modules === "string"
            ? JSON.parse(chapter.modules)
            : Array.isArray(chapter.modules)
            ? chapter.modules
            : [],
      })),
    [course.Chapter]
  );

  useEffect(() => {
    if (!currentChapterId || !currentModuleId) {
      const firstChapter = chapters.find((c) => c.isVisible);
      if (
        firstChapter &&
        firstChapter.modules &&
        Array.isArray(firstChapter.modules) &&
        firstChapter.modules.length > 0
      ) {
        const firstModule = firstChapter.modules
          .filter((m) => m != null)
          .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0))[0];
        if (firstModule) {
          const params = new URLSearchParams();
          params.set("chapter", firstChapter.id);
          params.set("module", firstModule.id);
          router.replace(`?${params.toString()}`);
        }
      }
    }
  }, [chapters, currentChapterId, currentModuleId, router]);

  // Get current module
  const getCurrentModule = () => {
    if (!currentChapterId || !currentModuleId) return null;

    const chapter = chapters.find((c) => c.id === currentChapterId);
    if (!chapter || !chapter.modules || !Array.isArray(chapter.modules))
      return null;

    const module = chapter.modules.find((m) => m && m.id === currentModuleId);
    return module || null;
  };

  const currentModule = getCurrentModule();

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Mobile Header - only on mobile; desktop has no top bar so sidebar and main align */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <h1 className="text-lg font-semibold truncate min-w-0 flex-1">{course.title}</h1>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-muted rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
          aria-label={t("openMenu")}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex gap-x-4 min-w-0 pt-6 lg:pt-8">
        {/* Sidebar - Desktop: course content panel */}
        <div className="hidden lg:block w-80 shrink-0">
          <CourseNavigator chapters={chapters} courseId={course.id} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="w-80 max-w-[85vw] bg-background border-r shadow-lg overflow-y-auto">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-semibold mb-1 truncate">{course.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    {course.level} • {course.sound}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-muted rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation shrink-0"
                  aria-label={t("closeMenu")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <CourseNavigator
                chapters={chapters}
                courseId={course.id}
                onModuleSelect={() => setSidebarOpen(false)}
              />
            </div>
            <div
              className="flex-1 bg-black/50"
              onClick={() => setSidebarOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
              role="button"
              tabIndex={0}
              aria-label={t("closeMenu")}
            />
          </div>
        )}

        {/* Main Content - same top alignment as sidebar via parent pt-6/pt-8 */}
        <div className="flex-1 min-h-screen min-w-0">
          <div className="pt-0 pl-4 pr-0 pb-4 lg:pl-6 lg:pr-0 lg:pb-6">
            {currentModule ? (
              <div className="space-y-4">
                {/* Video + prev/next in one block */}
                <div className="rounded-md border border-border bg-muted/50 overflow-hidden min-h-[200px]">
                  <div className="relative w-full aspect-video max-h-[min(70vh,520px)] bg-black/5 rounded-t-md overflow-hidden">
                    <VideoPlayer
                      key={currentModule.fileUrl}
                      videoId={currentModule.fileUrl}
                      title={undefined}
                      className="w-full h-full overflow-hidden rounded-t-md"
                    />
                  </div>
                  <CourseControls chapters={chapters} />
                </div>

                {/* Module title + content */}
                <div className="rounded-md border border-border bg-background p-5">
                  <h2 className="text-lg font-semibold mb-1">
                    {currentModule.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {Math.floor(currentModule.duration / 60)}:
                    {(currentModule.duration % 60).toString().padStart(2, "0")} · {currentModule.type}
                  </p>
                  {currentModule.content && currentModule.content !== "{}" && (
                    <ModuleContent content={currentModule.content} />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                <div className="text-center px-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {t("noModuleSelected")}
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    {t("selectModule")}
                  </p>
                  <p className="text-sm text-muted-foreground lg:hidden">
                    {t("openMenuToSelect")}
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
