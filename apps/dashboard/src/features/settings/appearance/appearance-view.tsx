import type { FC } from "react";
import AppearanceForm from "../forms/appearance-form";
import FormView from "../_components/form-view";

interface AppearanceViewProps {
  defaultLang: "en" | "ar";
}

const AppearanceView: FC<AppearanceViewProps> = ({ defaultLang }) => {
  return (
    <FormView
      defaultLang={defaultLang}
      title={{
        arabic: "المظهر",
        english: "Appearance",
      }}
    >
      <AppearanceForm lang={defaultLang} />
    </FormView>
  );
};

export default AppearanceView;
