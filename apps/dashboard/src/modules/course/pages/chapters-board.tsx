import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import { prisma } from "database/src";
import ChaptersBoard from "@/src/modules/course/components/chapters-board";
import useHaveAccess from "@/src/hooks/use-have-access";
import CourseHeader from "@/src/modules/course/components/course-header";

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

export default async function ChaptersBoardPage({ params }: PageProps) {
  const { course_id } = await params;
  const [user, chapters] = await Promise.all([
    useHaveAccess(),
    getChapters({ courseId: course_id }),
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
          title="محتوى الدورة"
          goBack
        />
        <CourseHeader />
        <ChaptersBoard initialData={chapters} />
      </main>
    </MaxWidthWrapper>
  );
}
