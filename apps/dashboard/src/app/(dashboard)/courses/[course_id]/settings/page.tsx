import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import CourseHeader from "@/src/components/course-header";
import { notFound } from "next/navigation";
import { CourseSettingsForm } from "@/src/components/forms/course-forms/course-settings";
import { prisma } from "database/src";
import useHaveAccess from "@/src/hooks/use-have-access";

interface PageProps {
  params: { course_id: string };
}

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

export default async function Page({ params }: PageProps) {
  const [user, course] = await Promise.all([
    useHaveAccess(),
    prisma.course.findUnique({
      where: {
        id: params.course_id,
      },
    }),
  ]);

  const notifications = await getAllNotifications({
    accountId: user.accountId,
  });

  if (!course) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col min-h-full  h-fit justify-start">
        <Header
          notifications={notifications}
          user={user}
          title={"اعدادات الدورة"}
          goBack
        />
        <CourseHeader />
        <CourseSettingsForm course={course} />
      </main>
    </MaxWidthWrapper>
  );
}
