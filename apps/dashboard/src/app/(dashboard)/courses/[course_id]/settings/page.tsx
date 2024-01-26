import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/Header";
import CourseHeader from "@/src/components/course-header";
import { User } from "@clerk/nextjs/dist/types/server";
import { currentUser } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";

// import ChaptersBoard from "@/src/components/chapters-board";
import { CourseSettingsForm } from "@/src/components/forms/course-forms/course-settings";
import { prisma } from "database/src";

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
      <main className="w-full flex flex-col min-h-full  h-fit justify-start">
        <Header
          user={{ user } as unknown as User}
          title={course.title}
          goBack
        />
        <CourseHeader />
        <CourseSettingsForm course={course} />
      </main>
    </MaxWidthWrapper>
  );
}
