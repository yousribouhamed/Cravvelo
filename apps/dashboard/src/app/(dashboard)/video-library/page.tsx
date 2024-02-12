import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import ApiVideoClient from "@api.video/nodejs-client";
import VediosListing from "@/src/components/vedios-lising";

const Page = async ({}) => {
  const user = await useHaveAccess();

  // First install the "@api.video/nodejs-client" npm package
  // Documentation: https://github.com/apivideo/api.video-nodejs-client/blob/main/doc/api/PlayerThemesApi.md#create

  const client = new ApiVideoClient({ apiKey: "YOUR_API_KEY" });

  const playerThemeCreationPayload = {
    text: "#ffffff", // RGBA color for timer text. Default: rgba(255, 255, 255, 1)
    link: "#ffffff", // RGBA color for all controls. Default: rgba(255, 255, 255, 1)
    linkHover: "#FC6B00", // RGBA color for all controls when hovered. Default: rgba(255, 255, 255, 1)
    trackPlayed: "#FC6B00", // RGBA color playback bar: played content. Default: rgba(88, 131, 255, .95)
    trackUnplayed: "#ffffff", // RGBA color playback bar: downloaded but unplayed (buffered) content. Default: rgba(255, 255, 255, .35)
    trackBackground: "rgba(255, 255, 255, 1)", // RGBA color playback bar: background. Default: rgba(255, 255, 255, .2)
    backgroundTop: "rgba(255, 255, 255, 1)", // RGBA color: top 50% of background. Default: rgba(0, 0, 0, .7)
    backgroundBottom: "rgba(255, 255, 255, 1)", // RGBA color: bottom 50% of background. Default: rgba(0, 0, 0, .7)
    backgroundText: "rgba(255, 255, 255, 1)", // RGBA color for title text. Default: rgba(255, 255, 255, 1)
    enableApi: true, // enable/disable player SDK access. Default: true
    enableControls: true, // enable/disable player controls. Default: true
    forceAutoplay: false, // enable/disable player autoplay. Default: false
    hideTitle: true, // enable/disable title. Default: false
    forceLoop: false, // enable/disable looping. Default: false
  };

  const videoClient = new ApiVideoClient({ apiKey: process.env.API_VEDIO_KEY });
  const videos = await videoClient.videos.list();

  const playerTheme = await videoClient.playerThemes.create(
    playerThemeCreationPayload
  );

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="مكتبة الفيديو" />
        <VediosListing videos={JSON.parse(JSON.stringify(videos))} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
