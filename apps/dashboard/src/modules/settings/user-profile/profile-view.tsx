import type { FC } from "react";
import UserProfileForm from "./profile-form";
import { Account } from "database";

interface profilePageProps {
  account: Account;
}

const ProfileView: FC<profilePageProps> = ({ account }) => {
  return (
    <div className="w-full min-h-[200px] h-fit flex flex-col gap-y-4  ">
      <h1 className="text-xl font-bold ">Profile</h1>
      <UserProfileForm account={account} />
    </div>
  );
};

export default ProfileView;
