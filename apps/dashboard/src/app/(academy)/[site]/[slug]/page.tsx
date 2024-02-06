import { getPage } from "../../actions";
import { notFound } from "next/navigation";
import PagePainterProduction from "../../builder-components/page-painter-production";

export const fetchCache = "force-no-store";

interface pageProps {
  params: { site: string; slug: string };
}

const Page = async ({ params }: pageProps) => {
  console.log(decodeURIComponent(params.slug));
  console.log(decodeURIComponent(params.site));
  const page = await getPage({
    path: `/${decodeURIComponent(params.slug)}`,
    subdomain:
      process.env.NODE_ENV === "development"
        ? "chehrichehri.jadir.vercel.app"
        : decodeURIComponent(params?.site),
  });

  if (!page) {
    notFound();
  }

  return <PagePainterProduction page={page} />;
};

export default Page;
