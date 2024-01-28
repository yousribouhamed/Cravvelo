import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/Header";
import useHaveAccess from "@/src/hooks/use-have-access";
import ApiVideoClient from "@api.video/nodejs-client";
import VediosListing from "@/src/components/vedios-lising";

const Page = async ({}) => {
  const { user, account } = await useHaveAccess();
  const videoClient = new ApiVideoClient({ apiKey: process.env.API_VEDIO_KEY });
  const videos = await videoClient.videos.list();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="مكتبة الفيديو" />
        <VediosListing videos={videos} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
