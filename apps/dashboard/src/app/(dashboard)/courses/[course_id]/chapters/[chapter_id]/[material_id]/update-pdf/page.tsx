import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import UpdateVedioForm from "@/src/components/forms/course-forms/chapters/update-chapters/update-video-form";
import { prisma } from "database/src";
import { Module } from "@/src/types";

interface PageProps {
  params: Promise<{
    course_id: string;
    chapter_id: string;
    material_id: string;
  }>;
}

const getMaterial = async ({
  chapter_id,
  fileUrl,
}: {
  chapter_id: string;
  fileUrl: string;
}): Promise<Module> => {
  try {
    const chapter = await prisma.chapter.findFirst({
      where: {
        id: chapter_id,
      },
    });

    const data = JSON.parse(chapter.modules as string) as Module[];

    const material = data.find((item) => item.fileUrl === fileUrl);

    return material;
  } catch (err) {
    console.error(err);
  }
};

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

export default async function Page({ params }: PageProps) {
  const { chapter_id, material_id } = await params;

  const [user, material] = await Promise.all([
    useHaveAccess(),
    getMaterial({ chapter_id, fileUrl: material_id }),
  ]);

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
          title="تحديث الفيديو"
        />
        <div className="w-full pt-8 min-h-[100px] ">
          <UpdateVedioForm material={material} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
