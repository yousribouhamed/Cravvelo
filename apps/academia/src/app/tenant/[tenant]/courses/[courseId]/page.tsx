import { getCourseById } from "@/modules/courses/actions/get-courses";
import CourseBuyCard from "@/modules/courses/components/course-buycard";
import Ratings from "@/modules/courses/components/rating";
import EmbedYouTubeVideo from "@/modules/courses/components/yotube-player";
import { CravveloEditor } from "@cravvelo/editor";

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

  const cleanDescription = course?.courseDescription.replace(/^"+|"+$/g, "");

  if (response.success && course) {
    return (
      <div className="w-full min-h-screen h-fit grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 my-8">
        <div className="w-full col-span-1 lg:col-span-2 h-fit min-h-[400px]">
          <h1 className="text-2xl font-bold">{course?.title}</h1>
          <div className="my-8 flex flex-col gap-y-4">
            <EmbedYouTubeVideo url={course.youtubeUrl} />

            <CravveloEditor readOnly value={cleanDescription ?? ""} />
            <Ratings />
          </div>
        </div>

        <CourseBuyCard course={course} />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black">
      <h1>hello there from course id</h1>
    </div>
  );
}
