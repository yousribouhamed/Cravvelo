import { ResetPasswordStep2Form } from "@/src/components/forms/reset-password-form-step2";
import PublicPageRestrictionGuard from "@/src/components/guards/page-restriction";
import type { FC } from "react";

interface pageAbdullahProps {}

const page: FC = ({}) => {
  return (
    <PublicPageRestrictionGuard>
      <div className="w-full h-screen flex items-center bg-[#FAFAFA]  p-4 md:p-0   justify-center">
        <ResetPasswordStep2Form />
      </div>
    </PublicPageRestrictionGuard>
  );
};

export default page;
