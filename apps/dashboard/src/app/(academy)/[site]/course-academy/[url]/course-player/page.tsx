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
import MaxWidthWrapper from "@/src/app/(academy)/_components/max-width-wrapper";
import { getStudent } from "@/src/app/(academy)/_actions/auth";

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

  console.log("here it the course from the student bag");

  console.log({ bag: currentBag?.courses });

  if (!course) {
    notFound();
  }

  const curentEpisose = currentBag?.courses?.find(
    (item) => item?.course.id === course?.id
  ).currentEpisode;

  if (!chapters || chapters?.length === 0) {
    return <h1>this course is empty</h1>;
  }

  return (
    <ContextMenuProvider>
      <div className="w-full h-full bg-white flex flex-col">
        <div className="w-[calc(100%-350px)] h-full mr-[350px] flex flex-col ">
          <div className="w-full  h-[100px]  border-b">
            <div className="h-full flex items-center justify-between px-4">
              <h1 className={"text-xl font-bold text-black"}>{course.title}</h1>

              <a href={"/"}>
                <button
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "space-x-4 flex items-center justify-end gap-x-4 "
                  )}
                >
                  العودة إلى الدورات
                  <LogOut className="w-4 h-4 text-black" />
                </button>
              </a>
            </div>
          </div>
          <div className="px-0 w-full">
            <div className="w-full  min-h-screen h-fit flex flex-col items-center gap-x-4 p-4   ">
              <div className="w-full h-fit max-h-[1500px] bg-black flex flex-col items-center  ">
                <CourseVideoPlayer videoId={getFirstVideo(chapters[0])} />
              </div>

              <div className="w-full h-[100px] my-4 flex items-center justify-between px-4 border rounded-xl">
                <span className="text-xl font-bold">current module</span>
                <button className="bg-blue-600  rounded-xl text-white py-2 px-4 ">
                  Complete and continue
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed top-0 bottom-1 right-0 w-[350px] h-full border-l ">
          <StudentProgress
            currentVideo={curentEpisose}
            totalVideos={course?.nbrChapters}
          />
          <div className="w-full h-full col-span-1 flex flex-col items-end py-8 border-l ">
            {" "}
            <VideoChain chapters={chapters} />
          </div>
        </div>
      </div>
    </ContextMenuProvider>
  );
};

export default Page;
