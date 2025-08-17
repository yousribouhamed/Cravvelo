import ChargilyConnector from "@/src/components/payments/chargily-connector";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import { prisma } from "database/src";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";

interface PageProps {}

const PageProps = async ({}) => {
  const user = await getMyUserAction();

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
