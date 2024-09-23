import type { FC } from "react";
import { Account } from "database";
import AppearanceForm from "../forms/appearance-form";

interface AppearanceViewProps {
  defaultLang: "en" | "ar";
}

const AppearanceView: FC<AppearanceViewProps> = ({ defaultLang }) => {
  return (
    <div className="w-full min-h-[200px] h-fit flex flex-col gap-y-4  ">
      <h1 className="text-xl font-bold ">Appearance</h1>
      <AppearanceForm lang={defaultLang} />
    </div>
  );
};

export default AppearanceView;
