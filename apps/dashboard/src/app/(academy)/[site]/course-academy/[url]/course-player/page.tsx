import { getCourseByUrlPath } from "@/src/app/(academy)/_actions/course";
import { get_course_chapters } from "@/src/app/(academy)/_actions/chapter";
import { notFound } from "next/navigation";
import { getStudent } from "@/src/app/(academy)/_actions/auth";
import { getSiteData } from "@/src/app/(academy)/_actions";
import { getSubDomainValue } from "@/src/app/(academy)/lib";
import PlayerBoard from "./_components/player-board";

interface PageProps {
  params: { site: string; url: string };
}

const Page = async ({ params }: PageProps) => {
  const course = await getCourseByUrlPath({ url: params?.url });

  const subdomain = getSubDomainValue({ value: params.site });

  const [student, website, chapters] = await Promise.all([
    getStudent(),
    getSiteData({
      subdomain,
    }),
    get_course_chapters({ courseID: course?.id }),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <PlayerBoard
      url={params?.url}
      chapters={chapters}
      course={course}
      initialStudent={student}
      website={website}
    />
  );
};

export default Page;

{
  /* <div className="w-full bg-white h-[100px] fixed top-0 shadow  z-[10] flex items-center justify-start  border-b">
<div className="h-full max-w-[1500px] mx-auto  w-full flex items-center px-4 ">
  <div className="w-[50%] h-full flex items-center justify-start gap-x-4">
    <div className="md:hidden">
      <VideoChainSheet
        color={website.color}
        currentVideo={currentEpisod ?? 0}
        totalVideos={course?.nbrChapters ?? 0}
        currentEpisode={currentEpisod}
        chapters={chapters}
      />
    </div>
    <h1 className={"text-xl font-bold text-black"}>
      {course.title}
    </h1>
  </div>
</div>
</div> */
}

{
  /* <div className="w-full h-full bg-white  flex flex-col ">
        <div className=" w-full md:w-[calc(100%-350px)] h-full md:mr-[350px] flex flex-col ">
          <PlayerLobby
            course={course}
            website={website}
            firstVideo={getFirstVideo(chapters[0])}
          />
        </div>

        <PlayerSidebarProps
          website={website}
          currentEpisode={currentEpisod ?? 0}
          chapters={chapters}
          course={course}
        />
      </div> */
}
