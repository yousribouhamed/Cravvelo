import React from "react";
import ProfileForm from "../../../_components/forms/profile-form";

interface pageProps {}

const Page = ({}) => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full h-[100px] flex items-center justify-start">
        <h1 className="text-3xl font-bold">الملف الشخصي</h1>
      </div>

      <ProfileForm />
    </div>
  );
};

export default Page;
