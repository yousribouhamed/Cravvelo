import { Student, Website, Chapter, Course } from "database";
import type { FC } from "react";
import StudentProgress from "../student-progress";
import VideoChain from "@/src/app/(academy)/_components/course-component/course-player/video-chain";

interface PlayerSidebarProps {
  currentEpisode: number;
  website: Website;
  chapters: Chapter[];
  course: Course;
}

const PlayerSidebar: FC<PlayerSidebarProps> = ({
  chapters,
  currentEpisode,
  website,
  course,
}) => {
  return (
    <div className=" hidden  md:block fixed top-0 shadow-xl bottom-1 right-0 w-[350px] h-full border-l ">
      <StudentProgress
        color={website.color}
        currentVideo={currentEpisode ?? 0}
        totalVideos={course?.nbrChapters ?? 0}
      />
      <div className="w-full h-full col-span-1 flex flex-col items-end py-8 border-l ">
        {" "}
        <VideoChain
          color={website.color}
          currentEpisode={currentEpisode}
          chapters={chapters}
        />
      </div>
    </div>
  );
};

export default PlayerSidebar;
