import { ResetPasswordForm } from "@/src/components/forms/reset-password-form";
import type { FC } from "react";

interface pageAbdullahProps {}

const page: FC = ({}) => {
  return (
    <div className="w-full h-screen flex items-center bg-[#FAFAFA]  justify-center">
      <ResetPasswordForm />
    </div>
  );
};

export default page;
