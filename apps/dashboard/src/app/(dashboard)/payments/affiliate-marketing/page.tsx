import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import ReferralTableShell from "./referral-table-shell";
import { prisma } from "database/src";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import { getServerTranslations } from "@/src/lib/i18n/utils";

const Page = async () => {
  const user = await getMyUserAction();
  const t = await getServerTranslations("affiliateMarketing");

  const [subscribers, notifications] = await Promise.all([
    prisma.referral.findMany({
      where: {
        accountId: user.accountId,
      },
    }),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header
          notifications={notifications}
          user={user}
          title={t("pageTitle")}
        />
        <ReferralTableShell initialData={subscribers} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
