"use client";

import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import HeaderLoading from "@/src/components/layout/header-loading";
import { HomePageSkeleton } from "@/src/modules/dashboard/components/home-page-skeleton";

const Page = () => {
  return (
    <MaxWidthWrapper>
      <main className="w-full">
        <HeaderLoading />
        <div className="my-4 w-full min-w-0 space-y-4 sm:space-y-6">
          <HomePageSkeleton />
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
