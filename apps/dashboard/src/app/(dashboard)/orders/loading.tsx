import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { DataTableLoading } from "@/src/components/data-table/table-helpers/table-loading";
import HeaderLoading from "@/src/components/layout/header-loading";

const Loading = async ({}) => {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <HeaderLoading />
        <DataTableLoading hideSearch columnCount={6} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Loading;
