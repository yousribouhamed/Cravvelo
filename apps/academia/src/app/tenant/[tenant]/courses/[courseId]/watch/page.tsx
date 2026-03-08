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
}

export default async function Page({ params }: PageProps) {
  const { courseId } = await params;
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">{t("error")}</h1>
          <p className="text-muted-foreground">
            {res.message || t("failedToLoad")}
          </p>
        </div>
      </div>
    );
  }

  return <CourseWatchClient course={res.data} />;
}
