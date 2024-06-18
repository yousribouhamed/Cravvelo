import CourseVideoPlayer from "@/src/app/(academy)/_components/course-component/course-player/video-player";
import { Course, Website } from "database";
import type { FC } from "react";
import CompleteCourse from "../complete-course";

interface PlayerLobbyProps {
  website: Website;
  firstVideo: string;
  course: Course;
  refetch: () => Promise<any>;
}

const PlayerLobby: FC<PlayerLobbyProps> = ({
  firstVideo,
  website,
  course,
  refetch,
}) => {
  return (
    <div className="px-0 w-full mx-auto ">
      <div className="w-full  bg-zinc-50  min-h-screen h-fit flex flex-col items-center gap-x-4 p-4   ">
        <div className="w-full h-fit max-h-[1500px]  bg-black flex flex-col items-center  ">
          <CourseVideoPlayer color={website.color} videoId={firstVideo} />
        </div>

        <CompleteCourse
          color={website.color}
          courseId={course.id}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default PlayerLobby;
