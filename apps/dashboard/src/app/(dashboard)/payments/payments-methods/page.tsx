import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import { getConnections } from "@/src/modules/payments/actions/connections";
import AvailablePaymentMethods from "@/src/modules/payments/pages/connections-listing.page";
import { getServerTranslations } from "@/src/lib/i18n/utils";

const Page = async ({}) => {
  const user = await getMyUserAction();
  const t = await getServerTranslations("paymentMethods");

  const [notifications, connections] = await Promise.all([
    getAllNotifications({ accountId: user.accountId }),
    getConnections().catch((error) => {
      console.error("Error fetching connections:", error);
      return {
        success: false,
        message: "Failed to load payment connections",
        data: [],
      };
    }),
  ]);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start items-start ">
        <Header
          notifications={notifications}
          user={user}
          title={t("title")}
        />
        <AvailablePaymentMethods connections={connections.data ?? []} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
