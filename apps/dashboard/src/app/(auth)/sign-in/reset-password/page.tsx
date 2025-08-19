import { ResetPasswordForm } from "@/src/components/forms/reset-password-form";
import PublicPageRestrictionGuard from "@/src/components/guards/page-restriction";
import type { FC } from "react";

const page: FC = () => {
  return (
    <PublicPageRestrictionGuard>
      <div className="w-full h-screen flex items-center bg-[#FAFAFA] p-4 md:p-0 justify-center">
        <ResetPasswordForm />
      </div>
    </PublicPageRestrictionGuard>
  );
};

export default page;
