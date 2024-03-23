import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Account } from "database";
import { prisma } from "database/src";
import UsersTableShell from "./users-table-shell";

async function getData(): Promise<Account[]> {
  const data = await prisma.account.findMany({});
  return data;
}

const Page = async ({}) => {
  const data = await getData();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header title="جميع المستخدمين" />
        <UsersTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
