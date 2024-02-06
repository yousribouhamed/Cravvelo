import { getPage } from "../actions";
import { notFound } from "next/navigation";
import PagePainterProduction from "../builder-components/page-painter-production";

export const fetchCache = "force-no-store";

interface pageAbdullahProps {
  params: { site: string };
}

const Page = async ({ params }: pageAbdullahProps) => {
  const page = await getPage({
    path: "/",
    subdomain: decodeURIComponent(params?.site),
  });

  if (!page) {
    notFound();
  }

  return <PagePainterProduction page={page} />;
};

export default Page;
