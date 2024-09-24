import type { FC } from "react";
import UserProfileForm from "./profile-form";
import { Account } from "database";
import FormView from "../_components/form-view";

interface profilePageProps {
  account: Account;
  defaultLang: "en" | "ar";
}

const ProfileView: FC<profilePageProps> = ({ account, defaultLang }) => {
  return (
    <FormView
      defaultLang={defaultLang}
      title={{
        arabic: "حساب تعريفي",
        english: "Profile",
      }}
    >
      <UserProfileForm lang={defaultLang} account={account} />
    </FormView>
  );
};

export default ProfileView;
