import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/Header";
import CourseHeader from "@/src/components/course-header";
import { User } from "@clerk/nextjs/dist/types/server";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "database/src";
import ChaptersBoard from "@/src/components/chapters-board";
import PublishCourseForm from "@/src/components/forms/course-forms/publish-form";

const getChapters = async () => {
  try {
    const chapters = await prisma.chapter.findMany();

    return chapters;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const chapters = await getChapters();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header user={{ user } as unknown as User} title="ui ux" goBack />
        <CourseHeader />
        <PublishCourseForm />
      </main>
    </MaxWidthWrapper>
  );
}
