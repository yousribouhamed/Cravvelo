import type { FC } from "react";
import { AcademySifnUpForm } from "../../../_components/forms/sign-up-form-production";

const Page: FC = ({}) => {
  return (
    <div className="w-full min-h-[700px] h-fit   flex items-center justify-center mt-[70px]">
      <AcademySifnUpForm />
    </div>
  );
};

export default Page;
