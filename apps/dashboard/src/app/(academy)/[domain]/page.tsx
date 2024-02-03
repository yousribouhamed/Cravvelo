import { getPage } from "../actions";
import { notFound } from "next/navigation";
import PagePainterProduction from "../_elements/page-painter";

interface pageAbdullahProps {
  params: { domain: string };
}

const Page = async ({ params }: pageAbdullahProps) => {
  const page = await getPage({ path: "/", subdomain: params?.domain });

  if (!page) {
    notFound();
  }

  return <PagePainterProduction page={page} />;
};

export default Page;
