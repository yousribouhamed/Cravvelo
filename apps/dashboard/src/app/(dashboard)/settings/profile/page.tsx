import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import {
  getAllNotifications,
  getMyUserAction,
  getUserProfileAction,
} from "@/src/actions/user.actions";
import GeneralSettingsHeader from "@/src/modules/settings/components/general-settings-header";
import ProfileForm from "@/src/app/(dashboard)/profile/ProfileForm";
import { getServerTranslations } from "@/src/lib/i18n/utils";

const Page = async ({}) => {
  const user = await getMyUserAction();
  const t = await getServerTranslations("pages");

  const notifications = await getAllNotifications({
    accountId: user?.accountId,
  });

  const profileData = await getUserProfileAction();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title={t("profile")}
        />

        <GeneralSettingsHeader />

        <div className="w-full h-full min-h-[500px] my-2">
          <ProfileForm enhancedUserData={profileData} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
