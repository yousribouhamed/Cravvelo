import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Homework } from "database";
import { prisma } from "database/src";
import HomeworksTableShell from "./HomeworksTableShell";
import useHaveAccess from "@/src/hooks/use-have-access";

async function getData(): Promise<Homework[]> {
  const data = await prisma.homework.findMany();
  return data;
}

const Page = async ({}) => {
  const user = await useHaveAccess();
  const data = await getData();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="الواجبات المنزلية" />
        <HomeworksTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
