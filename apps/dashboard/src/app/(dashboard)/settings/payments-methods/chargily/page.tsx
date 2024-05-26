import ChargilyConnector from "@/src/components/payments/chargily-connector";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import { prisma } from "database/src";

interface PageProps {}

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

const PageProps = async ({}) => {
  const user = await useHaveAccess();

  const [paymentsConnector, notifications] = await Promise.all([
    prisma.paymentsConnect.findFirst({
      where: {
        accountId: user.accountId,
      },
    }),
    getAllNotifications({ accountId: user.accountId }),
  ]);
  return (
    <MaxWidthWrapper>
      <main className="w-full min-h-screen h-fit flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title="بوابات الدفع"
        />
        <ChargilyConnector data={paymentsConnector} />
      </main>
    </MaxWidthWrapper>
  );
};

export default PageProps;
