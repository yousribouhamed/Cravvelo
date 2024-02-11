import { getPage } from "../actions";
import { notFound } from "next/navigation";
import PagePainterProduction from "../builder-components/page-painter-production";

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

  if (!page) {
    notFound();
  }

  return <PagePainterProduction subdomain={subdomain_value} page={page} />;
};

export default Page;
