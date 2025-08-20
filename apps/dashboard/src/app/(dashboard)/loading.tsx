import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Skeleton } from "@ui/components/ui/skeleton";
import HeaderLoading from "@/src/components/layout/header-loading";
import { LoadingSpinner } from "@ui/icons/loading-spinner";

const page = ({}) => {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col overflow-y-hidden h-fit  justify-start">
        <HeaderLoading title="الرئيسية" />
        <div className="w-full h-full flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default page;
