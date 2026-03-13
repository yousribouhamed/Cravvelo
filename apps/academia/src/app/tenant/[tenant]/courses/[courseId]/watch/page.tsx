import { redirect } from "next/navigation";
import { getCourseWithChapters } from "@/modules/profile/actions/course.actions";
import { CourseWatchClient } from "@/modules/courses/components/course-watch-client";
import { checkCourseOwnership } from "@/modules/courses/actions/check-ownership";
import { getCurrentUser } from "@/modules/auth/lib/utils";
import { getTranslations } from "next-intl/server";
import { checkVideoPlaybackAllowed } from "@/modules/courses/actions/check-video-playback";

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

function getModuleByIds(
  course: {
    Chapter: Array<{ id: string; modules?: unknown }>;
  },
  chapterId: string,
  moduleId: string
): { id: string; fileUrl?: string; type?: string; fileType?: string } | null {
  const chapter = course.Chapter.find((item) => item.id === chapterId);
  if (!chapter) return null;
  const modules = Array.isArray(chapter.modules)
    ? chapter.modules
    : typeof chapter.modules === "string"
      ? (() => {
          try {
            return JSON.parse(chapter.modules) as Array<{ id: string }>;
          } catch {
            return [];
          }
        })()
      : [];
  return (
    (modules.find(
      (module) => module && typeof module === "object" && (module as { id: string }).id === moduleId
    ) as { id: string; fileUrl?: string; type?: string; fileType?: string } | undefined) || null
  );
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

  if (chapterId && moduleId) {
    const selectedModule = getModuleByIds(course, chapterId, moduleId);
    const isVideoModule =
      selectedModule &&
      (selectedModule.type === "VIDEO" || selectedModule.fileType === "VIDEO");

    if (selectedModule?.fileUrl && isVideoModule) {
      const playbackAccess = await checkVideoPlaybackAllowed({
        videoId: selectedModule.fileUrl,
      });

      if (!playbackAccess.allowed) {
        return (
          <div className="flex items-center justify-center min-h-[400px] px-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-destructive mb-2">{t("error")}</h1>
              <p className="text-muted-foreground mb-4">
                {t("video.bandwidthLimitReached")}
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
    }
  }

  return <CourseWatchClient course={course} />;
}
