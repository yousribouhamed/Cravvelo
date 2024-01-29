import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import type { FC } from "react";
import AssetsForm from "../../components/forms/assets-form";
import LogoForm from "../../components/forms/logo-form";
import FontForm from "../../components/forms/font-form";
import FaviconForm from "../../components/forms/favicon-form";

interface pageAbdullahProps {}

const page: FC = ({}) => {
  return (
    <MaxWidthWrapper>
      <div className="w-full min-h-screen h-fit  bg-black flex flex-col overflow-y-auto   p-8 ">
        <h1 className="text-2xl font-bold text-start dark:text-white">
          أصول الموقع
        </h1>
        <div className="w-full min-h-[600px] h-fit mt-6 grid grid-cols-3 gap-4">
          <AssetsForm />

          <div className="col-span-1 flex flex-col gap-y-4">
            <LogoForm />
            <FontForm />
            <FaviconForm />
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
