import { getAllCourses, getPage } from "../actions";
import { notFound } from "next/navigation";
import ThemeHeaderProduction from "../builder-components/theme-header-production";
import ThemeFooterProduction from "../builder-components/theme-footer-production";
import MaxWidthWrapper from "../_components/max-width-wrapper";
import ThemeCollectionProduction from "../builder-components/theme-collection-production";

export const fetchCache = "force-no-store";

interface pageAbdullahProps {
  params: { site: string };
}

const Page = async ({ params }: pageAbdullahProps) => {
  const subdomain_value =
    process.env.NODE_ENV === "development"
      ? "best.jadir.vercel.app"
      : decodeURIComponent(params?.site);
  const page = await getPage({
    path: "/",
    subdomain: subdomain_value,
  });

  const courses = await getAllCourses({ subdomain: subdomain_value });

  if (!page) {
    notFound();
  }

  return (
    <>
      <ThemeHeaderProduction />
      <MaxWidthWrapper>
        <ThemeCollectionProduction courses={courses} />
      </MaxWidthWrapper>
      <ThemeFooterProduction />
    </>
  );
};

export default Page;
