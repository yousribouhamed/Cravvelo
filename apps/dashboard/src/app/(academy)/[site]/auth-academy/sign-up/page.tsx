import type { FC } from "react";
import ThemeFooterProduction from "../../../builder-components/theme-footer-production";
import ThemeHeaderProduction from "../../../builder-components/theme-header-production";
import { AcademySifnUpForm } from "../../../_components/forms/sign-up-form-production";

const Page: FC = ({}) => {
  return (
    <>
      <ThemeHeaderProduction />
      <div className="w-full min-h-[700px] h-fit   flex items-center justify-center mt-[70px]">
        <AcademySifnUpForm />
      </div>
      <ThemeFooterProduction />
    </>
  );
};

export default Page;
