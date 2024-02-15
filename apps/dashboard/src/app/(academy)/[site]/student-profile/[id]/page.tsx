import React from "react";
import LibraryNavigation from "../../../_components/library-navigation";

interface pageProps {}

const Page = ({}) => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full h-[100px] flex items-center justify-start">
        <h1 className="text-3xl font-bold">الملف الشخصي</h1>
      </div>
      <LibraryNavigation />
    </div>
  );
};

export default Page;
