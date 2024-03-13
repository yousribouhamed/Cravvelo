import VideoChain from "@/src/app/(academy)/_components/course-component/course-player/video-chain";
import CourseVideoPlayer from "@/src/app/(academy)/_components/course-component/course-player/video-player";
import { getCourseByUrlPath } from "@/src/app/(academy)/_actions/course";
import { get_course_chapters } from "@/src/app/(academy)/_actions/chapter";
import { Chapter } from "database";
import { Module } from "@/src/types";
import { notFound } from "next/navigation";
import MaxWidthWrapper from "@/src/app/(academy)/_components/max-width-wrapper";
import { buttonVariants } from "@ui/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@ui/lib/utils";
import { ContextMenuProvider } from "./context-menu";

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

  if (!course) {
    notFound();
  }

  if (!chapters || chapters?.length === 0) {
    return <h1>this course is empty</h1>;
  }

  return (
    <ContextMenuProvider>
      <div className="w-full h-full bg-white flex flex-col">
        <div className="w-full h-[70px]  border-b">
          <MaxWidthWrapper className="h-full flex items-center justify-between">
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
          </MaxWidthWrapper>
        </div>
        <MaxWidthWrapper>
          <div className="w-full h-screen grid grid-cols-3 gap-x-4 ">
            <div className="w-full h-full col-span-1 flex flex-col items-end py-8 border-l ">
              {" "}
              <VideoChain chapters={chapters} />
            </div>
            <div className="w-full h-full col-span-2 py-8">
              <CourseVideoPlayer videoId={getFirstVideo(chapters[0])} />
              <div className="w-full h-[70px] flex items-center justify-end">
                <button className="w-[100px] h-[50px] bg-primary p-2">
                  mark this video as completed
                </button>
                <button className="w-[100px] h-[50px] bg-primary p-2">
                  add comment
                </button>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </ContextMenuProvider>
  );
};

export default Page;
