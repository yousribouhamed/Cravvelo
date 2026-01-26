import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Student } from "database";
import { prisma } from "database/src";
import StudentsTableShell from "./StudentsTableShell";
import useHaveAccess from "@/src/hooks/use-have-access";
import { getServerTranslations } from "@/src/lib/i18n/utils";
import { getStudentStats } from "@/src/modules/students/actions/students";
import { StudentAnalytics } from "@/src/modules/students/components/student-analytics";

async function getData({
  accountId,
}: {
  accountId: string;
}) {
  const data = await prisma.student.findMany({
    where: {
      accountId,
    },
    select: {
      id: true,
      full_name: true,
      email: true,
      phone: true,
      photo_url: true,
      bio: true,
      isActive: true,
      emailVerified: true,
      lastVisitedAt: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          Sales: true,
          Certificates: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

const Page = async ({}) => {
  const user = await useHaveAccess();
  const t = await getServerTranslations("pages");

  const [data, notifications, stats] = await Promise.all([
    getData({ accountId: user.accountId }),
    getAllNotifications({ accountId: user.accountId }),
    getStudentStats(),
  ]);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header notifications={notifications} user={user} title={t("students")} />
        <StudentAnalytics stats={stats.data} />
        <StudentsTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
