import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/layout/header";
import CourseHeader from "@/src/components/course-header";
import { User } from "@clerk/nextjs/dist/types/server";
import { notFound } from "next/navigation";
import { prisma } from "database/src";
import ChaptersBoard from "@/src/components/chapters-board";
import PublishCourseForm from "@/src/components/forms/course-forms/publish-form";
import useHaveAccess from "@/src/hooks/use-have-access";

interface PageProps {
  params: { course_id: string };
}

export default async function Page({ params }: PageProps) {
  const user = await useHaveAccess();

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
        <Header user={user} title="ui ux" goBack />
        <CourseHeader />
        <PublishCourseForm />
      </main>
    </MaxWidthWrapper>
  );
}
