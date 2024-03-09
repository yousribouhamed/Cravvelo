"use client";

import { Dispatch, SetStateAction, type FC } from "react";
import { Dialog, DialogContent } from "@ui/components/ui/dialog";
import { EmbeddedVideo } from "../video-player";

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
        className="max-w-4xl min-h-[500px] h-fit  !p-0 "
      >
        <div className="w-full h-[500px] flex items-center justify-between">
          <EmbeddedVideo videoId={videoId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
