import { Course } from "database";
import { prisma } from "database/src";
import CoursesTableShell from "./courses-table-shell";
import useHaveAccess from "@/src/hooks/use-have-access";
import AppShell from "@/src/components/app-shell";

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

  const [data, notifications] = await Promise.all([
    getData({ accountId: user.accountId }),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  return (
    <AppShell user={user} notifications={notifications}>
      <CoursesTableShell academia_url={user.subdomain} initialData={data} />
    </AppShell>
  );
};

export default Page;
