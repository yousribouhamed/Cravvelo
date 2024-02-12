import type { FC } from "react";
import ThemeHeaderProduction from "../../builder-components/theme-header-production";
import ThemeFooterProduction from "../../builder-components/theme-footer-production";
import MaxWidthWrapper from "../../_components/max-width-wrapper";
import PaymentForm from "../../_components/forms/payment-form";

interface pageAbdullahProps {}

const Page: FC = ({}) => {
  return (
    <>
      <ThemeHeaderProduction />
      <MaxWidthWrapper>
        <PaymentForm />
      </MaxWidthWrapper>
      <ThemeFooterProduction />
    </>
  );
};

export default Page;
