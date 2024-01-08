import { SignInForm } from "@/src/components/forms/SignInForm";
import type { FC } from "react";

interface pageAbdullahProps {}

const page: FC = ({}) => {
  return (
    <div className="w-full h-screen flex items-center bg-[#FAFAFA]  justify-center">
      <SignInForm />
    </div>
  );
};

export default page;
