import { getCourseWithChapters } from "@/modules/profile/actions/course.actions";
import { CourseWatchClient } from "@/modules/courses/components/course-watch-client";

interface PageProps {
  params: Promise<{
    tenant: string;
    courseId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { courseId } = await params;

  const res = await getCourseWithChapters({ courseId });

  if (!res.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
          <p className="text-muted-foreground">
            {res.message || "Failed to load course"}
          </p>
        </div>
      </div>
    );
  }

  return <CourseWatchClient course={res.data} />;
}
