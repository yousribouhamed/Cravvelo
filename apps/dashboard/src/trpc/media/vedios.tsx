import ApiVideoClient from "@api.video/nodejs-client";
import { privateProcedure } from "../trpc";

export const videos = {
  getVediosListing: privateProcedure.query(async () => {
    const videoClient = new ApiVideoClient({
      apiKey: process.env.API_VEDIO_KEY,
    });
    const videos = await videoClient.videos.list();

    return videos;
  }),
};
