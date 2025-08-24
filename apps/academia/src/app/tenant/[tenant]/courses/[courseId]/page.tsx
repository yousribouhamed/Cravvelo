import { getCourseById } from "@/modules/courses/actions/get-courses";
import CourseBuyCard from "@/modules/courses/components/course-buycard";
import Ratings from "@/modules/courses/components/rating";
import EmbedYouTubeVideo from "@/modules/courses/components/yotube-player";
import { CravveloEditor } from "@cravvelo/editor";
import { PaymentSheet } from "@/modules/payments/components/payment-sheet";

interface PageProps {
  params: Promise<{
    tenant: string;
    courseId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { courseId } = await params;

  const response = await getCourseById({ courseId });
  const { data: course } = response;

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
          dir="rtl"
        >
          <div className="w-full col-span-1 lg:col-span-2 h-fit min-h-[400px]">
            <h1 className="text-2xl font-bold text-right text-gray-900 dark:text-white mb-4">
              {course?.title}
            </h1>
            <div className="my-8 flex flex-col gap-y-4">
              <EmbedYouTubeVideo url={course.youtubeUrl} />

              {/* Course Description Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-right text-gray-900 dark:text-white">
                    وصف الكورس
                  </h2>
                </div>
                <div className="p-0">
                  <CravveloEditor readOnly value={cleanDescription} />
                </div>
              </div>

              <Ratings />
            </div>
          </div>

          <CourseBuyCard course={course} />
        </div>

        <PaymentSheet />
      </>
    );
  }

  return (
    <div
      className="w-full h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
      dir="rtl"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          الكورس غير موجود
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          لم يتم العثور على الكورس المطلوب
        </p>
      </div>
    </div>
  );
}
