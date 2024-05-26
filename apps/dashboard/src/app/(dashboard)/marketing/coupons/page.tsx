import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import CouponsTableShell from "./CouponsTableShell";
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

  const [coupons, notifications] = await Promise.all([
    prisma.coupon.findMany({
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
          title="صانع القسائم"
        />
        <CouponsTableShell initialData={coupons} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
