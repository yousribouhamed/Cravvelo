import { Dispatch, SetStateAction, useState, type FC } from "react";
import ApiVideoPlayer from "@api.video/react-player";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog";

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
        className="max-w-4xl h-[500px] p-8 "
      >
        <div className="w-full flex items-center justify-between">
          <ApiVideoPlayer
            video={{ id: videoId }}
            style={{ width: 500, height: 300 }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
