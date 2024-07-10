import { ResetPasswordStep2Form } from "@/src/components/forms/reset-password-form-step2";
import type { FC } from "react";

interface pageAbdullahProps {}

const page: FC = ({}) => {
  return (
    <div className="w-full h-screen flex items-center bg-[#FAFAFA]  p-4 md:p-0   justify-center">
      <ResetPasswordStep2Form />
    </div>
  );
};

export default page;
