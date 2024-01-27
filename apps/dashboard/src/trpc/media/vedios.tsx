import ApiVideoClient from "@api.video/nodejs-client";
const client = new ApiVideoClient({ apiKey: "YOUR_API_KEY" });
import { privateProcedure } from "../trpc";
import { z } from "zod";

export const videos = {
  getVediosListing: privateProcedure.query(async () => {
    const videoClient = new ApiVideoClient({
      apiKey: process.env.API_VEDIO_KEY,
    });
    const videos = await videoClient.videos.list();

    return videos;
  }),
  onVedioUpload: privateProcedure
    .input(
      z.object({
        videoId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = new ApiVideoClient({
        apiKey: process.env["API_VEDIO_KEY"],
      });
      // define the value you want to update
      const videoUpdatePayload = {
        mp4Support: false, // Whether the player supports the mp4 format.
      };

      const updatedVideo = await client.videos.update(
        input.videoId,
        videoUpdatePayload
      );

      // then save the video in the database
    }),
};
