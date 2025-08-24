import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import ReferralTableShell from "./referral-table-shell";
import { prisma } from "database/src";

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

const Page = async () => {
  const user = await useHaveAccess();

  const [subscribers, notifications] = await Promise.all([
    prisma.referral.findMany({
      where: {
        accountId: user.accountId,
      },
    }),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title="التسويق بالعمولة"
        />
        <ReferralTableShell initialData={subscribers} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
