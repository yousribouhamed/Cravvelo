import { getUserProfile } from "@/modules/profile/actions/profile.actions";
import ProfileForm from "@/modules/profile/forms/profile.form";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const profile = await getUserProfile();
  const t = await getTranslations("profile");

  if (profile?.data) {
    return (
      <div className="w-full h-full flex flex-col gap-y-4 bg-white dark:bg-[#0A0A0C] dark:border-[#1F1F23]">
        <ProfileForm profileData={profile.data} />
      </div>
    );
  } else {
    return (
      <div className="w-full min-h-[200px] flex flex-col gap-y-4 bg-white dark:bg-[#0A0A0C] dark:border border-gray-200/80 dark:border-[#1F1F23] rounded-2xl">
        <div className="flex items-center justify-center flex-1 py-12 px-4">
          <p className="text-muted-foreground text-center">{t("errorLoading")}</p>
        </div>
      </div>
    );
  }
}
