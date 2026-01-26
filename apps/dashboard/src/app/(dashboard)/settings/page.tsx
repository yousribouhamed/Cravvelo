import GeneralSettings from "@/src/modules/settings/pages/general-settings";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import GeneralSettingsHeader from "@/src/modules/settings/components/general-settings-header";
import { getServerTranslations } from "@/src/lib/i18n/utils";

const Page = async ({}) => {
  const user = await getMyUserAction();
  const t = await getServerTranslations("settings");

  const notifications = await getAllNotifications({
    accountId: user?.accountId,
  });

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title={t("title")}
        />

        <GeneralSettingsHeader />

        <GeneralSettings />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
