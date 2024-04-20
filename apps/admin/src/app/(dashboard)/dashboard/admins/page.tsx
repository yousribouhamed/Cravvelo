import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Admin } from "database";
import { prisma } from "database/src";
import AdminTableShell from "./admin-table-shell";
import { ConfirmeDeleteAdmin } from "@/src/components/modals/confirme-delete-admin";

async function getData(): Promise<Admin[]> {
  const data = await prisma.admin.findMany({});
  return data;
}

const Page = async ({}) => {
  const data = await getData();

  return (
    <MaxWidthWrapper>
      <ConfirmeDeleteAdmin />
      <main className="w-full flex flex-col justify-start ">
        <Header title="حسابات المشرف" />
        <AdminTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
