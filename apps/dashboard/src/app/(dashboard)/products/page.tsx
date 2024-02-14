import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { prisma } from "database/src";
import ProductsTableShell from "./products-table-shell";
import useHaveAccess from "@/src/hooks/use-have-access";

const getData = async ({ accountId }: { accountId: string }) => {
  const products = await prisma.product.findMany({
    where: {
      accountId,
    },
  });
  return products;
};

const Page = async ({}) => {
  const user = await useHaveAccess();

  const data = await getData({ accountId: user.accountId });

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="المنتجات الرقمية" />

        <ProductsTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
