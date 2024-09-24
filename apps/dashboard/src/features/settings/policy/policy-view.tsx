import type { FC } from "react";
import FormView from "../_components/form-view";
import PolicyForm from "../forms/policy";

interface AppearanceViewProps {
  defaultLang: "en" | "ar";
  policy: any;
}

const PolicyView: FC<AppearanceViewProps> = ({ defaultLang, policy }) => {
  return (
    <FormView
      defaultLang={defaultLang}
      title={{
        arabic: "السياسة",
        english: "Policy",
      }}
    >
      <PolicyForm lang={defaultLang} policy={policy} />
    </FormView>
  );
};

export default PolicyView;
