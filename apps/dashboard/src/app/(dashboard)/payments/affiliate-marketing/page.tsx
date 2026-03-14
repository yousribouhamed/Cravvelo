import Link from "next/link";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import ReferralTableShell from "./referral-table-shell";
import { prisma } from "database/src";
import {
  getAllNotifications,
  getMyUserAction,
  getWebsiteByAccountId,
} from "@/src/actions/user.actions";
import { getServerTranslations } from "@/src/lib/i18n/utils";
import { Button } from "@ui/components/ui/button";

const Page = async () => {
  const user = await getMyUserAction();
  const t = await getServerTranslations("affiliateMarketing");

  const [subscribers, notifications, website] = await Promise.all([
    prisma.referral.findMany({
      where: {
        accountId: user.accountId,
      },
    }),
    getAllNotifications({ accountId: user.accountId }),
    getWebsiteByAccountId(user.accountId),
  ]);

  const enableReferral = website?.enableReferral ?? false;

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start gap-6">
        <Header
          notifications={notifications}
          user={user}
          title={t("pageTitle")}
        />
        <div className="flex flex-col gap-6">
          {enableReferral ? (
            <ReferralTableShell initialData={subscribers} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-12 text-center">
              <h3 className="text-lg font-semibold">
                {t("disabledState.title")}
              </h3>
              <p className="max-w-md text-sm text-muted-foreground">
                {t("disabledState.description")}
              </p>
              <Button asChild variant="default">
                <Link href="/settings/website-settings/marketing">
                  {t("disabledState.goToSettings")}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
