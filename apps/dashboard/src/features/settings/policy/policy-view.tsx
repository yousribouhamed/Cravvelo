import type { FC } from "react";
import { Account } from "database";

interface profilePageProps {
  account: Account;
}

const PolicyView: FC<profilePageProps> = ({ account }) => {
  return (
    <div className="w-full min-h-[200px] h-fit flex flex-col gap-y-4  ">
      <h1 className="text-xl font-bold ">Profile</h1>
    </div>
  );
};

export default PolicyView;
