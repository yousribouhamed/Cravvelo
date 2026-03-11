import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import GeneralSettingsHeader from "@/src/modules/settings/components/general-settings-header";
import { SubscriptionPlansView } from "@/src/modules/settings/components/subscription-plans-view";
import { CurrentPlanUsageView } from "@/src/modules/settings/components/current-plan-usage-view";
import { getSubscriptionPageData } from "@/src/modules/settings/actions/subscription-page.actions";
import { getServerTranslations } from "@/src/lib/i18n/utils";

export default async function SubscriptionSettingsPage() {
  const [user, subscriptionData] = await Promise.all([
    getMyUserAction(),
    getSubscriptionPageData(),
  ]);
  const t = await getServerTranslations("pages");

  const notifications = await getAllNotifications({
    accountId: user?.accountId,
  });

  const hasPlan = !!subscriptionData.subscription;

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title={t("subscription")}
        />

        <GeneralSettingsHeader />

        <div className="w-full py-6 space-y-8">
          {hasPlan && (
            <CurrentPlanUsageView data={subscriptionData} />
          )}
          <div id="plans">
            <SubscriptionPlansView />
          </div>
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
