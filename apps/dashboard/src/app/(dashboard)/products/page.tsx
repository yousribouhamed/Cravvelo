import Header from "@/src/components/Header";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import { prisma } from "database/src";
import ProductsTableShell from "./products-table-shell";
import useHaveAccess from "@/src/hooks/use-have-access";

interface pageAbdullahProps {}

const getData = async ({ accountId }: { accountId: string }) => {
  const products = await prisma.product.findMany({
    where: {
      accountId,
    },
  });
  return products;
};

const page = async ({}) => {
  const { account, user } = await useHaveAccess();

  const data = await getData({ accountId: account.id });

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="المنتجات الرقمية" />

        <ProductsTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default page;
