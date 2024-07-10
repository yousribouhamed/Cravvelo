import { VerifyEmail } from "@/src/components/forms/verify-email";
import type { FC } from "react";

const page: FC = ({}) => {
  return (
    <div className="w-full h-screen flex items-center bg-[#FAFAFA]  p-4 md:p-0   justify-center">
      <VerifyEmail />
    </div>
  );
};

export default page;
