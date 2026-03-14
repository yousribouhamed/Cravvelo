import { Course } from "database";
import { prisma } from "database/src";
import AppShell from "@/src/components/app-shell";
import CoursesPage from "@/src/modules/course/pages/courses-page";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import CreateAcademiaPage from "@/src/components/pages/create-academia.page";
import { getServerTranslations } from "@/src/lib/i18n/utils";

export const fetchCache = "force-no-store";

const PAGE_SIZE = 10;

async function getData({
  accountId,
}: {
  accountId: string;
}): Promise<{ courses: Course[]; totalCount: number; pageCount: number; currentPage: number }> {
  const [courses, totalCount] = await Promise.all([
    prisma.course.findMany({
      where: { accountId },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: 0,
    }),
    prisma.course.count({ where: { accountId } }),
  ]);
  const pageCount = Math.ceil(totalCount / PAGE_SIZE);
  return { courses, totalCount, pageCount, currentPage: 1 };
}

const Page = async ({}) => {
  const user = await getMyUserAction();
  const t = await getServerTranslations("pages");

  const [data, notifications] = await Promise.all([
    getData({ accountId: user.accountId }),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  if (!user?.subdomain) {
    return <CreateAcademiaPage notifications={notifications} user={user} />;
  }

  return (
    <AppShell
      title={t("courses")}
      user={user}
      notifications={notifications}
    >
      <CoursesPage initialData={data} />
    </AppShell>
  );
};

export default Page;
