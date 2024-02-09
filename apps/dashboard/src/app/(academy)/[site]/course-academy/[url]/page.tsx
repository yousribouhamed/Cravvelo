import MaxWidthWrapper from "../../../_components/max-width-wrapper";
import ThemeFooterProduction from "../../../builder-components/theme-footer-production";
import ThemeHeaderProduction from "../../../builder-components/theme-header-production";

export const fetchCache = "force-no-store";

interface pageAbdullahProps {
  params: { site: string };
}

const Page = async ({ params }: pageAbdullahProps) => {
  // fetch the data in here then pass it to the children
  return (
    <>
      <ThemeHeaderProduction />
      <MaxWidthWrapper className="mt-[70px] w-full h-fit min-h-screen">
        <div className="  w-full h-fit min-h-screen flex justify-between gap-x-4 items-start py-4">
          <div className="w-[calc(100%-300px)] min-h-[500px] bg-green-500"></div>
          <div className="w-[300px] h-[500px] rounded-xl border bg-primary"></div>
        </div>
      </MaxWidthWrapper>
      <ThemeFooterProduction />
    </>
  );
};

export default Page;
