import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import CourseHeader from "@/src/components/course-header";
import { notFound } from "next/navigation";
import { prisma } from "database/src";
import PublishCourseForm from "@/src/components/forms/course-forms/publish-form";
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

const getChapters = async ({ courseId }: { courseId: string }) => {
  try {
    const chapters = await prisma.chapter.findMany({
      orderBy: [
        {
          orderNumber: "asc",
        },
      ],
      where: {
        courseId: courseId,
      },
    });

    return chapters;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default async function Page({ params }: PageProps) {
  const { course_id } = await params;
  const [user, course, chapters] = await Promise.all([
    useHaveAccess(),
    prisma.course.findUnique({
      where: {
        id: course_id,
      },
    }),
    getChapters({ courseId: course_id }),
  ]);

  const notifications = await getAllNotifications({
    accountId: user.accountId,
  });

  if (!course) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header
          notifications={notifications}
          user={user}
          title="ناشر الدورة"
          goBack
        />
        <CourseHeader />
        <PublishCourseForm course={course} chapters={chapters} />
      </main>
    </MaxWidthWrapper>
  );
}
