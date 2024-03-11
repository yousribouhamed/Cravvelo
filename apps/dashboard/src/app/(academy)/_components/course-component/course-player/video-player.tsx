"use client";

import type { FC } from "react";
import { useCoursePlayerStore } from "../../../global-state/course-player-store";

interface VideoPlayerProps {
  videoId: string;
}

const CourseVideoPlayer: FC<VideoPlayerProps> = ({ videoId }) => {
  const { state } = useCoursePlayerStore();
  return (
    <>
      {/* <div className="w-full h-[50px] flex items-start justify-center gap-y-4 my-4 flex-col">
        <p className="text-xl font-bold">
          الفصل : {state?.currentModule?.title}
        </p>
        <span className="text-md text-gray-500">
          المادة : {state?.currentModule?.title}
        </span>
      </div> */}
      <div className="w-full h-[500px] rounded-xl bg-gray-200">
        {state?.currentModule ? (
          <div className="w-full h-[500px]  relative ">
            <iframe
              src={`https://iframe.mediadelivery.net/embed/212306/${state?.currentModule?.fileUrl}?autoplay=true`}
              loading="lazy"
              style={{
                border: "none",
                position: "absolute",

                height: "100%",
                width: "100%",
              }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={true}
            ></iframe>
          </div>
        ) : (
          <div className="w-full h-[500px]  relative ">
            <iframe
              src={`https://iframe.mediadelivery.net/embed/${process.env["NEXT_PUBLIC_VIDEO_LIBRARY"]}/${videoId}?autoplay=true`}
              loading="lazy"
              style={{
                border: "none",
                position: "absolute",

                height: "100%",
                width: "100%",
              }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={true}
            ></iframe>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseVideoPlayer;
