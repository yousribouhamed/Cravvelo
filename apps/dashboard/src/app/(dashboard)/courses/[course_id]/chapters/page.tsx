import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/layout/header";
import CourseHeader from "@/src/components/course-header";
import { User } from "@clerk/nextjs/dist/types/server";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "database/src";
import ChaptersBoard from "@/src/components/chapters-board";
import useHaveAccess from "@/src/hooks/use-have-access";

const getChapters = async () => {
  try {
    const chapters = await prisma.chapter.findMany({
      orderBy: [
        {
          orderNumber: "asc",
        },
      ],
    });

    return chapters;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default async function Home() {
  const user = await useHaveAccess();
  const chapters = await getChapters();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header user={user} title="ui ux" goBack />
        <CourseHeader />
        <ChaptersBoard initialData={chapters} />
      </main>
    </MaxWidthWrapper>
  );
}
