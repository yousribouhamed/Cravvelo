import { type FC } from "react";
import {
  ComponentBuilder,
  ThemePage,
} from "../../(theme-editor)/theme-editor-store";
import ThemeHeaderProduction from "./theme-header-production";
import ThemeFooterProduction from "./theme-footer-production";
import ThemeHeadingProduction from "./theme-heading-production";
import ThemeCollectionProduction from "./theme-collection-production";
import ThemeSignupProduction from "./theme-signup-production";
import ThemeSigninProduction from "./theme-signin-production";
import MaxWidthWrapper from "../_components/max-width-wrapper";

interface PagePainterProps {
  page: ThemePage;
}

const PagePainterProduction: FC<PagePainterProps> = ({ page }) => {
  return (
    <div dir="rtl" className="w-full h-fit">
      <ThemeHeaderProduction />
      <MaxWidthWrapper>
        {Array.isArray(page.components) &&
          page.components.map((item, index) => (
            <>{renderBuilderComponentProduction({ components: item })}</>
          ))}
      </MaxWidthWrapper>
      <ThemeFooterProduction />
    </div>
  );
};

export default PagePainterProduction;

export const renderBuilderComponentProduction = ({
  components,
}: {
  components: ComponentBuilder;
}) => {
  switch (components.type) {
    case "header":
      return null;
    case "footer":
      return null;
    case "collection":
      return <ThemeHeadingProduction />;
    case "heading":
      return <ThemeCollectionProduction />;
    case "signupform":
      return <ThemeSignupProduction />;
    case "signinform":
      return <ThemeSigninProduction />;
    default:
      return <h1>this compoent does&apos;t exists</h1>;
  }
};
