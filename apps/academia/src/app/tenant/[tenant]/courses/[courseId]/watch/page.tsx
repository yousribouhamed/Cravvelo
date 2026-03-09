import { redirect } from "next/navigation";
import { getCourseWithChapters } from "@/modules/profile/actions/course.actions";
import { CourseWatchClient } from "@/modules/courses/components/course-watch-client";
import { checkCourseOwnership } from "@/modules/courses/actions/check-ownership";
import { getCurrentUser } from "@/modules/auth/lib/utils";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{
    tenant: string;
    courseId: string;
  }>;
  searchParams: Promise<{ chapter?: string; module?: string }>;
}

function getFirstValidChapterModule(
  chapters: Array<{
    id: string;
    isVisible?: boolean;
    modules?: unknown;
  }>
): { chapterId: string; moduleId: string } | null {
  const visible = chapters
    .filter((c) => c.isVisible !== false)
    .sort((a, b) => ((a as { orderNumber?: number }).orderNumber ?? 0) - ((b as { orderNumber?: number }).orderNumber ?? 0));
  for (const ch of visible) {
    const mods = Array.isArray(ch.modules)
      ? ch.modules
      : typeof ch.modules === "string"
        ? (() => {
            try {
              return JSON.parse(ch.modules) as unknown[];
            } catch {
              return [];
            }
          })()
        : [];
    const sorted = mods
      .filter((m) => m && typeof m === "object" && "id" in m)
      .sort((a, b) => ((a as { orderNumber?: number }).orderNumber ?? 0) - ((b as { orderNumber?: number }).orderNumber ?? 0));
    if (sorted.length > 0) {
      return { chapterId: ch.id, moduleId: (sorted[0] as { id: string }).id };
    }
  }
  return null;
}

function chapterModuleBelongsToCourse(
  course: { Chapter: Array<{ id: string; modules?: unknown }> },
  chapterId: string,
  moduleId: string
): boolean {
  const ch = course.Chapter.find((c) => c.id === chapterId);
  if (!ch) return false;
  const mods = Array.isArray(ch.modules)
    ? ch.modules
    : typeof ch.modules === "string"
      ? (() => {
          try {
            return JSON.parse(ch.modules) as Array<{ id: string }>;
          } catch {
            return [];
          }
        })()
      : [];
  return mods.some((m) => m && typeof m === "object" && (m as { id: string }).id === moduleId);
}

export default async function Page({ params, searchParams }: PageProps) {
  const { courseId } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("watch");

  const user = await getCurrentUser();
  if (!user) {
    redirect(
      "/login?redirect=" + encodeURIComponent("/courses/" + courseId + "/watch")
    );
  }

  const ownershipRes = await checkCourseOwnership({ courseId });
  if (!ownershipRes.data) {
    redirect("/courses/" + courseId);
  }

  const res = await getCourseWithChapters({ courseId });

  if (!res.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">{t("error")}</h1>
          <p className="text-muted-foreground mb-4">
            {res.message || t("failedToLoad")}
          </p>
          <a
            href={"/courses/" + courseId}
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("backToCourse")}
          </a>
        </div>
      </div>
    );
  }

  const course = res.data;
  const chapterId = resolvedSearchParams.chapter;
  const moduleId = resolvedSearchParams.module;

  if (chapterId && moduleId) {
    const isValid = chapterModuleBelongsToCourse(course, chapterId, moduleId);
    if (!isValid) {
      const first = getFirstValidChapterModule(course.Chapter);
      if (first) {
        redirect(
          `/courses/${courseId}/watch?chapter=${encodeURIComponent(first.chapterId)}&module=${encodeURIComponent(first.moduleId)}`
        );
      }
      redirect("/courses/" + courseId + "/watch");
    }
  }

  return <CourseWatchClient course={course} />;
}
