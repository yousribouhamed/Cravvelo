import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import CourseHeader from "@/src/modules/course/components/course-header";
import StudentEngagment from "@/src/components/forms/course-forms/students-engagment";
import useHaveAccess from "@/src/hooks/use-have-access";
import { prisma } from "database/src";

export const fetchCache = "force-no-store";

interface PageProps {
  params: Promise<{ course_id: string }>;
}

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

export default async function Home({ params }: PageProps) {
  const { course_id } = await params;
  const [user, course] = await Promise.all([
    useHaveAccess(),
    prisma.course.findUnique({
      where: {
        id: course_id,
      },
    }),
  ]);

  const notifications = await getAllNotifications({
    accountId: user.accountId,
  });

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header
          notifications={notifications}
          user={user}
          title="تفاعل الطلاب"
          goBack
        />
        <CourseHeader />
        <StudentEngagment course={course} />
      </main>
    </MaxWidthWrapper>
  );
}
