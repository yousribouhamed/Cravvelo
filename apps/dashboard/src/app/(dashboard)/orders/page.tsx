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

const PAGE_SIZE = 10;

async function getData(accountId: string): Promise<{
  orders: Sale[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
}> {
  const [orders, totalCount] = await Promise.all([
    prisma.sale.findMany({
      where: { accountId },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: 0,
    }),
    prisma.sale.count({ where: { accountId } }),
  ]);
  const pageCount = Math.ceil(totalCount / PAGE_SIZE);
  return { orders, totalCount, pageCount, currentPage: 1 };
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
