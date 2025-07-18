import { ResetPasswordForm } from "@/src/components/forms/reset-password-form";
import type { FC } from "react";

const page: FC = () => {
  return (
    <div className="w-full h-screen flex items-center bg-[#FAFAFA] p-4 md:p-0 justify-center">
      <ResetPasswordForm />
    </div>
  );
};

export default page;
