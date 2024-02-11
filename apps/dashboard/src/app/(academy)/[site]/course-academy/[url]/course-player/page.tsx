import CourseContent from "@/src/app/(academy)/_components/course-component/course-content";
import VideoChain from "@/src/app/(academy)/_components/course-component/course-player/video-chain";
import MaxWidthWrapper from "@/src/app/(academy)/_components/max-width-wrapper";
import ThemeFooterProduction from "@/src/app/(academy)/builder-components/theme-footer-production";
import ThemeHeaderProduction from "@/src/app/(academy)/builder-components/theme-header-production";
import type { FC } from "react";

interface PageProps {}

const Page: FC = ({}) => {
  return (
    <div className="w-full h-full">
      <ThemeHeaderProduction />
      <MaxWidthWrapper className="mt-[70px]">
        <div className="w-full min-h-[700px] h-fit grid grid-cols-3 gap-x-4 ">
          <div className="w-full h-full col-span-1 flex flex-col items-end py-8 ">
            {" "}
            <VideoChain />
          </div>
          <div className="w-full h-full col-span-2 py-8">
            <div className="w-full h-[400px] rounded-xl bg-gray-200"></div>
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
      </MaxWidthWrapper>
      <ThemeFooterProduction />
    </div>
  );
};

export default Page;
