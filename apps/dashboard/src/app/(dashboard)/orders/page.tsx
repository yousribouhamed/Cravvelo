import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Sale } from "database";
import { prisma } from "database/src";
import OrdersTableShell from "./OrdersTableShell";
import useHaveAccess from "@/src/hooks/use-have-access";

async function getData(): Promise<Sale[]> {
  const data = await prisma.sale.findMany();
  return data;
}

const Page = async ({}) => {
  const user = await useHaveAccess();
  const data = await getData();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="الطلبات" />
        <OrdersTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
