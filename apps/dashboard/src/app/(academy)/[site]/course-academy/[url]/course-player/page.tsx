import VideoChain from "@/src/app/(academy)/_components/course-component/course-player/video-chain";
import CourseVideoPlayer from "@/src/app/(academy)/_components/course-component/course-player/video-player";
import { getCourseByUrlPath } from "@/src/app/(academy)/actions/course";
import { get_course_chapters } from "@/src/app/(academy)/actions/chapter";
import { authorization } from "@/src/app/(academy)/actions/auth";

interface PageProps {
  params: { site: string; url: string };
}

const Page = async ({ params }: PageProps) => {
  await authorization();
  const course = await getCourseByUrlPath({ url: params?.url });
  const chapters = await get_course_chapters({ courseID: course?.id });

  return (
    <>
      <div className="w-full min-h-[700px] h-fit grid grid-cols-3 gap-x-4 ">
        <div className="w-full h-full col-span-1 flex flex-col items-end py-8 ">
          {" "}
          <VideoChain chapters={chapters} />
        </div>
        <div className="w-full h-full col-span-2 py-8">
          <CourseVideoPlayer videoId={chapters[0]?.modules[0]?.fileUrl ?? ""} />
          <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
            <button className="w-[100px] h-[40px] rounded-xl bg-blue-500 text-white">
              التعليقات
            </button>

            <button className="w-[100px] h-[40px] rounded-xl bg-gray-500 text-white">
              المحتوى
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
