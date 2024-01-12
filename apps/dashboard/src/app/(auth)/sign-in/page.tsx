import { SignInForm } from "@/src/components/forms/sign-in-form";
import type { FC } from "react";

//
const page: FC = ({}) => {
  return (
    <div className="w-full h-screen flex items-center bg-[#FAFAFA] justify-center">
      <SignInForm />
    </div>
  );
};

export default page;
