import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import GeneralSettingsHeader from "@/src/modules/settings/components/general-settings-header";
import { SubscriptionPlansView } from "@/src/modules/settings/components/subscription-plans-view";
import { getServerTranslations } from "@/src/lib/i18n/utils";

export default async function SubscriptionSettingsPage() {
  const user = await getMyUserAction();
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

        <div className="w-full py-6">
          <SubscriptionPlansView />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
