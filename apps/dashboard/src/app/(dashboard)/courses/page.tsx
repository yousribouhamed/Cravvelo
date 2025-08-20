import { Course } from "database";
import { prisma } from "database/src";
import AppShell from "@/src/components/app-shell";
import CoursesPage from "@/src/modules/course/pages/courses-page";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import CoursesTableShell from "./courses-table-shell";
import CreateAcademiaPage from "@/src/components/pages/create-academia.page";

export const fetchCache = "force-no-store";

async function getData({
  accountId,
}: {
  accountId: string;
}): Promise<Course[]> {
  const data = await prisma.course.findMany({
    where: {
      accountId,
    },
  });
  return data;
}

const Page = async ({}) => {
  const user = await getMyUserAction();

  const [data, notifications] = await Promise.all([
    getData({ accountId: user.accountId }),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  if (!user?.subdomain) {
    return <CreateAcademiaPage notifications={notifications} user={user} />;
  }

  return (
    <AppShell user={user} notifications={notifications}>
      <CoursesTableShell
        academia_url={user?.customDomain ?? user.subdomain}
        initialData={data}
      />
    </AppShell>
  );
};

export default Page;
