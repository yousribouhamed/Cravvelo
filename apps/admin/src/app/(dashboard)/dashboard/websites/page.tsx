import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Website } from "database";
import { prisma } from "database/src";
import WebsiteTableShell from "./websites-table-shell";

async function getData(): Promise<Website[]> {
  const data = await prisma.website.findMany({});
  return data;
}

const Page = async ({}) => {
  const data = await getData();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header title="جميع المواقع" />
        <WebsiteTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
