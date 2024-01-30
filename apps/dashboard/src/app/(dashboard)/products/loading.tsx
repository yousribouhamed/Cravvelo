import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import { DataTableLoading } from "@/src/components/data-table/table-loading";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const loading = async ({}) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="الدورات التدريبية" />
        <DataTableLoading columnCount={6} />
      </main>
    </MaxWidthWrapper>
  );
};

export default loading;
