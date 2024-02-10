import type { FC } from "react";
import ThemeFooterProduction from "../../../builder-components/theme-footer-production";
import ThemeHeaderProduction from "../../../builder-components/theme-header-production";
import { AcademySignIpForm } from "../../../_components/forms/sign-in-form-production";

interface PageAbdullahProps {}

const Page: FC = ({}) => {
  return (
    <>
      <ThemeHeaderProduction />
      <div className="w-full min-h-[700px] h-fit flex items-center justify-center mt-[70px]">
        <AcademySignIpForm />
      </div>
      <ThemeFooterProduction />
    </>
  );
};

export default Page;
