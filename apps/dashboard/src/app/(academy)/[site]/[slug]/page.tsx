import { getPage } from "../../actions";
import { notFound } from "next/navigation";
import PagePainterProduction from "../../builder-components/page-painter-production";

export const fetchCache = "force-no-store";

interface pageProps {
  params: { site: string; slug: string };
}

const Page = async ({ params }: pageProps) => {
  const page = await getPage({
    path: `/${params.slug}`,
    subdomain: decodeURIComponent(params?.site),
  });

  if (!page) {
    notFound();
  }

  return <PagePainterProduction page={page} />;
};

export default Page;
