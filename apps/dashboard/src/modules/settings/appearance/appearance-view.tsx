import type { FC } from "react";
import { Account } from "database";
import { AppearanceForm } from "./appearance-form";

interface AppearanceViewProps {}

const AppearanceView: FC<AppearanceViewProps> = ({}) => {
  return (
    <div className="w-full min-h-[200px] h-fit flex flex-col gap-y-4  ">
      <h1 className="text-xl font-bold ">Appearance</h1>
      <AppearanceForm />
    </div>
  );
};

export default AppearanceView;
