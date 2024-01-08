import { SignUnForm } from "@/src/components/forms/SignUpForm";
import type { FC } from "react";

interface pageAbdullahProps {}

const page: FC = ({}) => {
  return (
    <div className="w-full h-screen flex items-center bg-[#FAFAFA]  justify-center">
      <SignUnForm />
    </div>
  );
};

export default page;
