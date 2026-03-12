import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import GeneralSettingsHeader from "@/src/modules/settings/components/general-settings-header";
import { getSubscriptionPageData } from "@/src/modules/settings/actions/subscription-page.actions";
import { getServerTranslations } from "@/src/lib/i18n/utils";
import { SubscriptionSettingsContent } from "@/src/modules/settings/components/subscription-settings-content";

export default async function SubscriptionSettingsPage() {
  const [user, subscriptionData] = await Promise.all([
    getMyUserAction(),
    getSubscriptionPageData(),
  ]);
  const t = await getServerTranslations("pages");

  const notifications = await getAllNotifications({
    accountId: user?.accountId,
  });

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title={t("subscription")}
        />

        <GeneralSettingsHeader />
        <SubscriptionSettingsContent data={subscriptionData} />
      </main>
    </MaxWidthWrapper>
  );
}
