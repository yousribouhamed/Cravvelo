import type { FC } from "react";
import { AcademySignIpForm } from "../../../_components/forms/sign-in-form-production";

interface PageProps {}

const Page: FC = ({}) => {
  return (
    <div className="w-full min-h-[700px] h-fit flex items-center justify-center mt-[70px]">
      <AcademySignIpForm />
    </div>
  );
};

export default Page;
