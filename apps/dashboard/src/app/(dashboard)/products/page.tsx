import Header from "@/src/components/Header";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import { DataTable } from "@/src/components/data-table";
import { ProctsColumns } from "@/src/components/data-table/columns/products";
import { currentUser } from "@clerk/nextjs";
import { prisma } from "database/src";
import { redirect } from "next/navigation";

interface pageAbdullahProps {}

const getData = async () => {
  const products = await prisma.product.findMany();
  return products;
};

const page = async ({}) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const data = await getData();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="المنتجات الرقمية" />
        <DataTable columns={ProctsColumns} data={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default page;
