import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import { prisma } from "database/src";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import { getConnections } from "@/src/modules/payments/actions/connections";
import AvailablePaymentMethods from "@/src/modules/payments/pages/connections-listing.page";

const Page = async ({}) => {
  const user = await getMyUserAction();

  const [notifications, connections] = await Promise.all([
    getAllNotifications({ accountId: user.accountId }),
    getConnections(),
  ]);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start items-start ">
        <Header
          notifications={notifications}
          user={user}
          title="بوابات الدفع"
        />
        <AvailablePaymentMethods connections={connections.data ?? []} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
