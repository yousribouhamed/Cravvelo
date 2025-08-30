import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import { ChargilyConnectPage } from "@/src/modules/payments/pages/chargily.page";
import { getChargilyConnection } from "@/src/modules/payments/actions/chargily";

const PageProps = async () => {
  const user = await getMyUserAction();

  const [connection, notifications] = await Promise.all([
    getChargilyConnection(),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  const config =
    connection.data === null
      ? null
      : {
          publicKey: connection.data.config.publicKey,
          secretKey: connection.data.config.secretKey,
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

        <ChargilyConnectPage
          isAlreadyActive={connection.data.isActive}
          config={config}
        />
      </main>
    </MaxWidthWrapper>
  );
};

export default PageProps;
