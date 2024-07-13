import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import PaymentMethodsConnectors from "@/src/components/payments/payment-methods-connector";
import useHaveAccess from "@/src/hooks/use-have-access";
import { prisma } from "database/src";

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

  const [notifications, paymentsConnector] = await Promise.all([
    getAllNotifications({ accountId: user.accountId }),
    prisma.paymentsConnect.findFirst({
      where: {
        accountId: user.accountId,
      },
    }),
  ]);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start items-start ">
        <Header
          notifications={notifications}
          user={user}
          title="بوابات الدفع"
        />
        <PaymentMethodsConnectors data={paymentsConnector} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
