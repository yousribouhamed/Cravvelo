import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { DataTableLoading } from "@/src/components/data-table/table-loading";
import useHaveAccess from "@/src/hooks/use-have-access";

const Loading = async ({}) => {
  const user = await useHaveAccess();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header notifications={[]} user={user} title="الدورات التدريبية" />
        <DataTableLoading columnCount={6} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Loading;
