import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import HeaderLoading from "@/src/components/layout/header-loading";
import { LoadingSpinner } from "@ui/icons/loading-spinner";

const Loading = async ({}) => {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <HeaderLoading title="الدورات التدريبية" />
        <div className="w-full h-full flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default Loading;
