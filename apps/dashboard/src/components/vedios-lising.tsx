"use client";

import VideosListResponse from "@api.video/nodejs-client/lib/model/VideosListResponse";
import { useState, type FC } from "react";
import { trpc } from "../app/_trpc/client";
import { Card, CardContent } from "@ui/components/ui/card";
import { NotFoundCard } from "./not-found-card";
import Image from "next/image";
import VideoPlayer from "./models/video-player";

interface VediosType {
  videos: VideosListResponse;
}
const VediosListing: FC<VediosType> = ({ videos }) => {
  const { data } = trpc.getVediosListing.useQuery(undefined, {
    initialData: videos,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  return (
    <>
      <VideoPlayer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        videoId={selectedVideoId}
      />
      <div className="w-full h-fit min-h-[300px] p-6">
        <h1 className="text-start font-bold text-2xl ">
          مكتبة الفيديو الخاصة بك
        </h1>

        <div className="w-full flex flex-wrap gap-x-4">
          {videos.data.length === 0 && <NotFoundCard />}
          {videos.data.map((video, i) => (
            <Card
              onClick={() => {
                setIsOpen(true);
                setSelectedVideoId(video.videoId);

                console.log("here it is the video id");
                console.log(video.videoId);
              }}
              key={video.videoId}
            >
              <CardContent className="p-0">
                <div className="w-full p-0  ">
                  <Image
                    src={video.assets.thumbnail}
                    alt={video.title}
                    width={400}
                    height={300}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default VediosListing;
