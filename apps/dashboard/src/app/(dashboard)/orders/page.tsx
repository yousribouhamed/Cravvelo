import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Sale } from "database";
import { prisma } from "database/src";
import OrdersTableShell from "./OrdersTableShell";
import useHaveAccess from "@/src/hooks/use-have-access";

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

async function getData(accountId: string): Promise<Sale[]> {
  const data = await prisma.sale.findMany({
    where: {
      accountId,
    },
  });
  return data;
}

const Page = async ({}) => {
  const user = await useHaveAccess();

  const [data, notifications] = await Promise.all([
    getData(user.accountId),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header notifications={notifications} user={user} title="المبيعات" />
        <OrdersTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
