"use client";
import ApiVideoPlayer from "@api.video/react-player";

import type { FC } from "react";
import { useCoursePlayerStore } from "../../../global-state/course-player-store";

interface VideoPlayerProps {
  videoId: string;
}

const CourseVideoPlayer: FC<VideoPlayerProps> = ({ videoId }) => {
  const { state } = useCoursePlayerStore();
  return (
    <>
      <div className="w-full h-[50px] flex items-start justify-center gap-y-4 my-4 flex-col">
        <p className="text-xl font-bold">
          الفصل : {state?.currentModule?.title}
        </p>
        <span className="text-md text-gray-500">
          المادة : {state?.currentModule?.title}
        </span>
      </div>
      <div className="w-full h-[500px] rounded-xl bg-gray-200">
        <ApiVideoPlayer
          video={{
            id:
              state?.currentModule?.fileUrl &&
              state?.currentModule?.fileUrl !== ""
                ? state?.currentModule?.fileUrl
                : videoId,
          }}
          style={{ width: "100%", height: "100%" }}
          theme={{
            text: "#ffffff",
            link: "#ffffff",
            linkHover: "#3b82f6",
            trackPlayed: "#3b82f6",
            trackUnplayed: "#ffffff",
            trackBackground: "#3b82f6",
            backgroundTop: "#3b82f6",
            backgroundBottom: "#3b82f6",
            backgroundText: "#ffffff",
          }}
        />
      </div>
    </>
  );
};

export default CourseVideoPlayer;
