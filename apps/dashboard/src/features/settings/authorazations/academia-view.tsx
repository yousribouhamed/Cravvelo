import type { FC } from "react";
import FormView from "../_components/form-view";
import ReferralForm from "../forms/referral-form";

interface AppearanceViewProps {
  defaultLang: "en" | "ar";
  referalEnabled: boolean;
}

const AuthorazationsView: FC<AppearanceViewProps> = ({
  defaultLang,
  referalEnabled,
}) => {
  return (
    <FormView
      defaultLang={defaultLang}
      title={{
        arabic: "التصاريح",
        english: "Authorazations",
      }}
    >
      <ReferralForm enabled={referalEnabled} />
    </FormView>
  );
};

export default AuthorazationsView;
