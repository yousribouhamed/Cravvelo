import VideoChain from "@/src/app/(academy)/_components/course-component/course-player/video-chain";
import CourseVideoPlayer from "@/src/app/(academy)/_components/course-component/course-player/video-player";
import { getCourseByUrlPath } from "@/src/app/(academy)/_actions/course";
import { get_course_chapters } from "@/src/app/(academy)/_actions/chapter";
import { Chapter } from "database";
import { Module, StudentBag } from "@/src/types";
import { notFound } from "next/navigation";
import { buttonVariants } from "@ui/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@ui/lib/utils";
import { ContextMenuProvider } from "./context-menu";
import StudentProgress from "./student-progress";
import { getStudent } from "@/src/app/(academy)/_actions/auth";
import CompleteCourse from "./complete-course";
import VideoChainSheet from "@/src/app/(academy)/_components/course-component/course-player/video-chain-sheet";

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
  // await authorization({ origin: null });

  const course = await getCourseByUrlPath({ url: params?.url });
  const chapters = await get_course_chapters({ courseID: course?.id });

  const student = await getStudent();

  const currentBag = (await JSON.parse(student.bag as string)) as StudentBag;

  // redirect the user if he is not loged in or paid user

  console.log("here it the course from the student bag");

  console.log({ bag: currentBag?.courses });

  if (!course) {
    notFound();
  }

  const currentEpisod = currentBag?.courses?.find(
    (item) => item?.course.id === course?.id
  ).currentEpisode;

  if (!chapters || chapters?.length === 0) {
    return <h1>this course is empty</h1>;
  }

  return (
    <ContextMenuProvider>
      <div className="w-full h-full bg-white flex flex-col ">
        <div className=" w-full md:w-[calc(100%-350px)] h-full md:mr-[350px] flex flex-col ">
          <div className="w-full bg-white h-[100px] fixed top-0  z-[10] flex items-center justify-start  border-b">
            <div className="h-full max-w-[1500px] mx-auto  w-full flex items-center px-4 ">
              <div className="w-[50%] h-full flex items-center justify-start gap-x-4">
                <div className="md:hidden">
                  <VideoChainSheet
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
          <div className="px-0 w-full mt-[100px] max-w-[1500px]  mx-auto">
            <div className="w-full  min-h-screen h-fit flex flex-col items-center gap-x-4 p-4   ">
              <div className="w-full h-fit max-h-[1500px]  bg-black flex flex-col items-center  ">
                <CourseVideoPlayer videoId={getFirstVideo(chapters[0])} />
              </div>

              <CompleteCourse courseId={course.id} />
            </div>
          </div>
        </div>
        <div className=" hidden md:block fixed top-0 bottom-1 right-0 w-[350px] h-full border-l ">
          <StudentProgress
            currentVideo={currentEpisod ?? 0}
            totalVideos={course?.nbrChapters ?? 0}
          />
          <div className="w-full h-full col-span-1 flex flex-col items-end py-8 border-l ">
            {" "}
            <VideoChain currentEpisode={currentEpisod} chapters={chapters} />
          </div>
        </div>
      </div>
    </ContextMenuProvider>
  );
};

export default Page;
