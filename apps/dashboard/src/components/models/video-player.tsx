"use client";

import { Dispatch, SetStateAction, type FC } from "react";
import ApiVideoPlayer from "@api.video/react-player";
import { Dialog, DialogContent } from "@ui/components/ui/dialog";

interface VideoPlayerProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  videoId: string;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ isOpen, setIsOpen, videoId }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DialogContent
        title={"مشغل فديوهات"}
        className="max-w-4xl min-h-[500px] h-fit pb-2  "
      >
        <div className="w-full h-full flex items-center justify-between">
          <ApiVideoPlayer
            video={{ id: videoId }}
            style={{ width: "100%", height: 450 }}
            // theme={{
            //   text: "#ffffff", // RGBA color for timer text. Default: rgba(255, 255, 255, 1)
            //   link: "#ffffff", // RGBA color for all controls. Default: rgba(255, 255, 255, 1)
            //   linkHover: "#FC6B00", // RGBA color for all controls when hovered. Default: rgba(255, 255, 255, 1)
            //   trackPlayed: "#FC6B00", // RGBA color playback bar: played content. Default: rgba(88, 131, 255, .95)
            //   trackUnplayed: "#ffffff", // RGBA color playback bar: downloaded but unplayed (buffered) content. Default: rgba(255, 255, 255, .35)
            //   trackBackground: "rgba(255, 255, 255, 1)", // RGBA color playback bar: background. Default: rgba(255, 255, 255, .2)
            //   backgroundTop: "rgba(255, 255, 255, 1)", // RGBA color: top 50% of background. Default: rgba(0, 0, 0, .7)
            //   backgroundBottom: "rgba(255, 255, 255, 1)", // RGBA color: bottom 50% of background. Default: rgba(0, 0, 0, .7)
            //   backgroundText: "rgba(255, 255, 255, 1)", // RGBA color for title text. Default: rgba(255, 255, 255, 1)
            // }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
