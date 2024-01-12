import { ResetPasswordStep2Form } from "@/src/components/forms/reset-password-form-step2";
import type { FC } from "react";

interface pageAbdullahProps {}

const page: FC = ({}) => {
  return (
    <div className="w-full h-screen flex items-center bg-[#FAFAFA]  justify-center">
      <ResetPasswordStep2Form />
    </div>
  );
};

export default page;
