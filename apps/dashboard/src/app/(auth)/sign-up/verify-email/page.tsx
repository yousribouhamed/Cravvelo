import { VerifyEmail } from "@/src/components/forms/verify-email";
import type { FC } from "react";

interface pageAbdullahProps {}

const page: FC = ({}) => {
  return (
    <div className="w-full h-screen flex items-center bg-[#FAFAFA]  justify-center">
      <VerifyEmail />
    </div>
  );
};

export default page;
