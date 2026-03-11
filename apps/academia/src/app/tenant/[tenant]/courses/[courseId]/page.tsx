import { getCourseById } from "@/modules/courses/actions/get-courses";
import CourseBuyCard from "@/modules/courses/components/course-buycard";
import { CoursePreviewVideo } from "@/modules/courses/components/course-preview-video";
import Ratings from "@/modules/courses/components/rating";
import { CravveloEditor } from "@cravvelo/editor";
import { PaymentSheet } from "@/modules/payments/components/payment-sheet";
import { checkCourseOwnership } from "@/modules/courses/actions/check-ownership";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{
    tenant: string;
    courseId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { courseId } = await params;
  const t = await getTranslations("courses");

  const [response, ownershipResponse] = await Promise.all([
    getCourseById({ courseId }),
    checkCourseOwnership({ courseId }),
  ]);
  const { data: course } = response;
  const isOwned = ownershipResponse.data || false;

  // Safe description cleaning - check if courseDescription exists and is a string
  const cleanDescription =
    course?.courseDescription && typeof course.courseDescription === "string"
      ? course.courseDescription.replace(/^"+|"+$/g, "")
      : "";

  if (response.success && course) {
    return (
      <>
        <div
          className="w-full min-h-screen h-fit grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 my-8"
        >
          <div className="w-full col-span-1 lg:col-span-2 min-h-[400px]">
            <h1 className="text-2xl font-bold text-start text-foreground mb-4">
              {course?.title}
            </h1>
            <div className="my-8 flex flex-col gap-y-4">
              <CoursePreviewVideo
                previewVideo={course.preview_video}
                youtubeUrl={course.youtubeUrl}
              />

              {/* Course Description Section */}
              <div className="bg-card text-card-foreground rounded-lg border border-border">
                <div className="p-4 border-b border-border">
                  <h2 className="text-lg font-semibold text-start">
                    {t("description")}
                  </h2>
                </div>
                <div className="p-0">
                  <CravveloEditor readOnly value={cleanDescription} />
                </div>
              </div>

              <Ratings
                courseId={courseId}
                initialComments={course.Comment || []}
                allowComment={course.allowComment}
                allowRating={course.allowRating}
              />
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <CourseBuyCard course={course} isOwned={isOwned} courseId={courseId} />
          </div>
        </div>

        <PaymentSheet />
      </>
    );
  }

  return (
    <div
      className="w-full h-screen bg-background flex items-center justify-center"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t("notFound")}
        </h1>
        <p className="text-muted-foreground">
          {t("notFoundMessage")}
        </p>
      </div>
    </div>
  );
}
