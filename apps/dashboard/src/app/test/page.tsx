"use client";

import { type FC } from "react";
import Image from "next/image";
import axios from "axios";

const page: FC = ({}) => {
  const makeCall = async () => {
    const { data } = await axios.get(
      `https://video.bunnycdn.com/library/${process.env["NEXT_PUBLIC_VIDEO_LIBRARY"]}/videos/57c8fe54-48cc-4173-adf2-579cf5050a38`,
      {
        headers: {
          "Content-Type": "application/octet-stream",
          AccessKey: process.env["NEXT_PUBLIC_BUNNY_API_KEY"],
        },
      }
    );

    console.log(data);
  };
  return (
    <div className="w-full h-screen flex items-center  flex-col gap-y-8 justify-center pt-12">
      <button onClick={makeCall}>click me</button>
    </div>
  );
};

export default page;
