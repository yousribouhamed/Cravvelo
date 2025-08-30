import P2PConnector from "@/src/modules/payments/components/p2p-form";

import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";

import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";

import { getP2pConnection } from "@/src/modules/payments/actions/p2p";

interface PageProps {}

const PageProps = async ({}) => {
  const user = await getMyUserAction();

  const [connection, notifications] = await Promise.all([
    getP2pConnection(),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  const config =
    connection.data === null
      ? null
      : {
          accountHolder: connection.data.config.accountHolder,
          accountNumber: connection.data.config.accountNumber,
          bankDetails: connection.data.config.bankDetails,
          bankName: connection.data.config.bankName,
          notes: connection.data.config.notes,
          routingNumber: connection.data.config.routingNumber,
        };
  return (
    <MaxWidthWrapper>
      <main className="w-full min-h-screen h-fit flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title="بوابات الدفع"
          goBack
        />

        <P2PConnector
          isAlreadyActive={connection.data.isActive}
          data={config}
        />
      </main>
    </MaxWidthWrapper>
  );
};

export default PageProps;
