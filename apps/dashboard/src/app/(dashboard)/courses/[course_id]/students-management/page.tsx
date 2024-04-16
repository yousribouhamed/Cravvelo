import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import CourseHeader from "@/src/components/course-header";
import StudentEngagment from "@/src/components/forms/course-forms/students-engagment";
import useHaveAccess from "@/src/hooks/use-have-access";
import { prisma } from "database/src";

interface PageProps {
  params: { course_id: string };
}

export default async function Home({ params }: PageProps) {
  const [user, course] = await Promise.all([
    useHaveAccess(),
    prisma.course.findUnique({
      where: {
        id: params.course_id,
      },
    }),
  ]);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header notifications={[]} user={user} title="تفاعل الطلاب" goBack />
        <CourseHeader />
        <StudentEngagment course={course} />
      </main>
    </MaxWidthWrapper>
  );
}
