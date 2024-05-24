import VideoChain from "@/src/app/(academy)/_components/course-component/course-player/video-chain";
import CourseVideoPlayer from "@/src/app/(academy)/_components/course-component/course-player/video-player";
import { getCourseByUrlPath } from "@/src/app/(academy)/_actions/course";
import { get_course_chapters } from "@/src/app/(academy)/_actions/chapter";
import { Chapter } from "database";
import { Module, StudentBag } from "@/src/types";
import { notFound } from "next/navigation";
import { buttonVariants } from "@ui/components/ui/button";
import { ContextMenuProvider } from "./context-menu";
import StudentProgress from "./student-progress";
import { getStudent } from "@/src/app/(academy)/_actions/auth";
import CompleteCourse from "./complete-course";
import VideoChainSheet from "@/src/app/(academy)/_components/course-component/course-player/video-chain-sheet";
import { getSiteData } from "@/src/app/(academy)/_actions";
import { getSubDomainValue } from "@/src/app/(academy)/lib";

interface PageProps {
  params: { site: string; url: string };
}

const getFirstVideo = (chapter: Chapter): string => {
  const modules = JSON.parse(chapter?.modules as string) as Module[];

  if (!modules) {
    return "";
  }
  const video = modules[0]?.fileUrl;

  return video;
};

const Page = async ({ params }: PageProps) => {
  const course = await getCourseByUrlPath({ url: params?.url });

  const subdomain = getSubDomainValue({ value: params.site });

  const [student, website, chapters] = await Promise.all([
    getStudent(),
    getSiteData({
      subdomain,
    }),
    get_course_chapters({ courseID: course?.id }),
  ]);

  const currentBag = (await JSON.parse(student.bag as string)) as StudentBag;

  if (!course) {
    notFound();
  }

  const currentEpisod = currentBag?.courses?.find(
    (item) => item?.course.id === course?.id
  ).currentEpisode;

  if (!chapters || chapters?.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col gap-y-6">
        <h1 className="text-xl font-bold text-black">لقد اشتريت دورة فارغة </h1>
      </div>
    );
  }

  return (
    <ContextMenuProvider>
      <div className="w-full h-full bg-white  flex flex-col ">
        <div className=" w-full md:w-[calc(100%-350px)] h-full md:mr-[350px] flex flex-col ">
          <div className="w-full bg-white h-[100px] fixed top-0 shadow  z-[10] flex items-center justify-start  border-b">
            <div className="h-full max-w-[1500px] mx-auto  w-full flex items-center px-4 ">
              <div className="w-[50%] h-full flex items-center justify-start gap-x-4">
                <div className="md:hidden">
                  <VideoChainSheet
                    color={website.color}
                    currentVideo={currentEpisod ?? 0}
                    totalVideos={course?.nbrChapters ?? 0}
                    currentEpisode={currentEpisod}
                    chapters={chapters}
                  />
                </div>
                <h1 className={"text-xl font-bold text-black"}>
                  {course.title}
                </h1>
              </div>
            </div>
          </div>
          <div className="px-0 w-full mt-[100px] max-w-[1500px]    mx-auto">
            <div className="w-full  bg-zinc-50  min-h-screen h-fit flex flex-col items-center gap-x-4 p-4   ">
              <div className="w-full h-fit max-h-[1500px]  bg-black flex flex-col items-center  ">
                <CourseVideoPlayer
                  color={website.color}
                  videoId={getFirstVideo(chapters[0])}
                />
              </div>

              <CompleteCourse color={website.color} courseId={course.id} />
            </div>
          </div>
        </div>
        <div className=" hidden md:block fixed top-0 shadow bottom-1 right-0 w-[350px] h-full border-l ">
          <StudentProgress
            color={website.color}
            currentVideo={currentEpisod ?? 0}
            totalVideos={course?.nbrChapters ?? 0}
          />
          <div className="w-full h-full col-span-1 flex flex-col items-end py-8 border-l ">
            {" "}
            <VideoChain
              color={website.color}
              currentEpisode={currentEpisod}
              chapters={chapters}
            />
          </div>
        </div>
      </div>
    </ContextMenuProvider>
  );
};

export default Page;
