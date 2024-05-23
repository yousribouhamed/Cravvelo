import { Button } from "@ui/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@ui/components/ui/sheet";
import { Candy } from "lucide-react";
import StudentProgress from "../../../[site]/course-academy/[url]/course-player/student-progress";
import VideoChain from "./video-chain";

import type { FC } from "react";
import { Chapter } from "database";

interface VideoChainSheetProps {
  chapters: Chapter[];
  currentEpisode: number;
  totalVideos: number;
  currentVideo: number;
  color: string;
}

const VideoChainSheet: FC<VideoChainSheetProps> = ({
  chapters,
  currentEpisode,
  currentVideo,
  totalVideos,
  color,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Candy className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className=" w-full h-full  ">
          <StudentProgress
            color={color}
            currentVideo={currentEpisode}
            totalVideos={totalVideos}
          />
          <div className="w-full h-full col-span-1 flex flex-col items-end py-8  ">
            {" "}
            <VideoChain
              color={color}
              currentEpisode={currentEpisode}
              chapters={chapters}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default VideoChainSheet;
