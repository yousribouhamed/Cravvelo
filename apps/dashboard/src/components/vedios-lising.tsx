"use client";

import VideosListResponse from "@api.video/nodejs-client/lib/model/VideosListResponse";
import Link from "next/link";
import type { FC } from "react";
import { trpc } from "../app/_trpc/client";
import { Button } from "@ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";

import AddVedio from "./models/add-vedio";
import { NotFoundCard } from "./not-found-card";

interface VediosType {
  videos: VideosListResponse;
}
const VediosListing: FC<VediosType> = ({ videos }) => {
  const { data } = trpc.getVediosListing.useQuery(undefined, {
    initialData: videos,
  });

  console.log(data);
  return (
    <div className="w-full h-fit min-h-[300px] p-6">
      <h1 className="text-start font-bold text-2xl ">
        مكتبة الفيديو الخاصة بك
      </h1>
      <div className="w-full h-[100px] flex items-center justify-end">
        <AddVedio />
      </div>

      <div className="w-full flex flex-wrap gap-x-4">
        {videos.data.length === 0 && <NotFoundCard />}
        {videos.data.map((video, i) => (
          <Link key={i} href={`videos/${video.videoId}`}>
            {video.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VediosListing;

interface VideoCardInterface {
  title: string;
  thumnail: string;
}

const VideoCard = ({ thumnail, title }: VideoCardInterface) => {
  return (
    <Card>
      <CardContent>
        <div className="w-full ">
          <Image src={thumnail} alt={title} fill />
        </div>
      </CardContent>
      <CardFooter>
        <p>{title}</p>
      </CardFooter>
    </Card>
  );
};
