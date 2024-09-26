import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Course } from "database";
import { prisma } from "database/src";
import CoursesTableShell from "./courses-table-shell";
import useHaveAccess from "@/src/hooks/use-have-access";
import { PAGES_INFO_AR, PAGES_INFO_EN } from "@cravvelo/i18n";

// react-countup

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

  const PAGES_INFO = user.lang === "en" ? PAGES_INFO_EN : PAGES_INFO_AR;

  const [data, notifications] = await Promise.all([
    getData({ accountId: user.accountId }),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title={PAGES_INFO.cources}
        />
        <CoursesTableShell
          academia_url={user.subdomain}
          initialData={data}
          lang={user.lang}
        />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
