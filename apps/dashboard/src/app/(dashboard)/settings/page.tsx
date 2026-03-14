import { isRedirectError } from "next/navigation";
import GeneralSettings from "@/src/modules/settings/pages/general-settings";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import HeaderLoading from "@/src/components/layout/header-loading";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import GeneralSettingsHeader from "@/src/modules/settings/components/general-settings-header";
import { getServerTranslations } from "@/src/lib/i18n/utils";
import SettingsUnavailable from "@/src/modules/settings/components/settings-unavailable";

const Page = async () => {
  let user;
  let notifications: Awaited<ReturnType<typeof getAllNotifications>> = [];

  try {
    user = await getMyUserAction();
  } catch (err) {
    if (isRedirectError(err)) throw err;
    const t = await getServerTranslations("settings");
    return (
      <MaxWidthWrapper>
        <main className="w-full flex flex-col justify-start">
          <HeaderLoading />
          <GeneralSettingsHeader />
          <SettingsUnavailable title={t("title")} />
        </main>
      </MaxWidthWrapper>
    );
  }

  try {
    notifications = await getAllNotifications({
      accountId: user.accountId,
    });
  } catch {
    notifications = [];
  }

  const t = await getServerTranslations("settings");

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
