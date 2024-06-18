"use client";

import { Module, StudentBag } from "@/src/types";
import { Chapter, Course, Student, Website } from "database";
import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStudent } from "@/src/app/(academy)/_actions/auth";
import PlayerLobby from "./player-lobby";
import PlayerSidebar from "./player-sidebar";

const getFirstVideo = (chapter: Chapter): string => {
  const modules = JSON.parse(chapter?.modules as string) as Module[];

  if (!modules) {
    return "";
  }
  const video = modules[0]?.fileUrl;

  return video;
};

interface PlayerBoardProps {
  initialStudent: Student;
  url: string;
  website: Website;
  chapters: Chapter[];
  course: Course;
}

function calculateProgress(episode: number, videos: number): number {
  if (episode < 0 || videos < 1 || episode > videos) {
    return 100;
  }

  const progressPercentage = (episode / videos) * 100;
  return parseFloat(progressPercentage.toFixed(0));
}

const PlayerBoard: FC<PlayerBoardProps> = ({
  chapters,
  initialStudent,
  website,

  course,
  url,
}) => {
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const data = await getStudent();
      return data;
    },
    initialData: initialStudent,
  });

  const currentBag = JSON.parse(data.bag as string) as StudentBag;

  const currentEpisode = currentBag?.courses?.find(
    (item) => item?.course.id === course?.id
  ).currentEpisode;

  const progress = calculateProgress(currentEpisode, course?.nbrChapters ?? 0);

  return (
    <div className="w-full h-screen  max-w-screen-2xl mx-auto relative flex flex-col items-center">
      <div className=" w-[calc(100%-350px)] h-fit min-h-screen  mx-auto mr-[350px]">
        <PlayerLobby
          refetch={refetch}
          course={course}
          firstVideo={getFirstVideo(chapters[0])}
          progress={progress}
          website={website}
        />
      </div>

      <PlayerSidebar
        chapters={chapters}
        course={course}
        currentEpisode={currentEpisode}
        website={website}
      />
    </div>
  );
};

export default PlayerBoard;

// if (!chapters || chapters?.length === 0) {
//     return (
//       <div className="w-full h-screen flex items-center justify-center flex-col gap-y-6">
//         <h1 className="text-xl font-bold text-black">لقد اشتريت دورة فارغة </h1>
//       </div>
//     );
//   }
