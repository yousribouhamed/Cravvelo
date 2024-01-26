import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/Header";
import CourseHeader from "@/src/components/course-header";
import { User } from "@clerk/nextjs/dist/types/server";
import { currentUser } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { prisma } from "database/src";
import ChaptersBoard from "@/src/components/chapters-board";

interface PageProps {
  params: { course_id: string };
}

export default async function Page({ params }: PageProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.course_id,
    },
  });

  if (!course) {
    notFound();
  }
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header user={{ user } as unknown as User} title="ui ux" goBack />
        <CourseHeader />
      </main>
    </MaxWidthWrapper>
  );
}
