import { getUserProfile } from "@/modules/profile/actions/profile.actions";
import ProfileForm from "@/modules/profile/forms/profile.form";

export default async function Page() {
  const profile = await getUserProfile();

  console.log(profile);

  if (profile?.data) {
    return (
      <div className="w-full h-full flex flex-col gap-y-4 bg-white dark:bg-[#0A0A0C] dark:border-[#1F1F23]">
        <ProfileForm profileData={profile.data} />
      </div>
    );
  } else {
    return (
      <div className="w-full h-[400px] flex flex-col gap-y-4 bg-white dark:bg-[#0A0A0C] dark:border-[#1F1F23]">
        error
      </div>
    );
  }
}
