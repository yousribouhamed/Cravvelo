import HeaderLoading from "@/src/components/layout/header-loading";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import ApplicationsBoardSkeleton from "@/src/modules/apps/skeletons/application-board-skeleton";

export default function Loading() {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <HeaderLoading />
        <ApplicationsBoardSkeleton />
      </main>
    </MaxWidthWrapper>
  );
}
