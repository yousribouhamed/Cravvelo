import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import AddVedioForm from "@/src/components/forms/course-forms/add-vedio-form";
import useHaveAccess from "@/src/hooks/use-have-access";
import { prisma } from "database/src";

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

interface PageProps {
  params: Promise<{
    course_id: string;
    chapter_id: string;
  }>;
}

export default async function Home({ params }: PageProps) {
  const user = await useHaveAccess();

  const { chapter_id, course_id } = await params;

  const notifications = await getAllNotifications({
    accountId: user.accountId,
  });

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header
          notifications={notifications}
          goBack
          user={user}
          title="اضافة فيديو"
        />

        <div className="w-full pt-8 min-h-[100px] h-fit mb-10 ">
          <AddVedioForm chapterID={chapter_id} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
