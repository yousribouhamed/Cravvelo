import { getUserProfileAction } from "@/src/actions/user.actions";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const profileData = await getUserProfileAction();

  return (
    <div className="w-full h-full min-h-[500px] my-2">
      <ProfileForm enhancedUserData={profileData} />
    </div>
  );
}
