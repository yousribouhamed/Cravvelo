import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import CourseHeader from "@/src/modules/course/components/course-header";
import { notFound } from "next/navigation";
import { CourseSettingsForm } from "@/src/components/forms/course-forms/course-settings";
import { prisma } from "database/src";
import useHaveAccess from "@/src/hooks/use-have-access";

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

export default async function Page({ params }: PageProps) {
  const { course_id } = await params;

  const user = await useHaveAccess();

  const [course, notifications] = await Promise.all([
    prisma.course.findUnique({
      where: {
        id: course_id,
      },
    }),
    getAllNotifications({
      accountId: user.accountId,
    }),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col min-h-full h-fit justify-start">
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
