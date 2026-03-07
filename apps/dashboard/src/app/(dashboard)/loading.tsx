"use client";

import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import HeaderLoading from "@/src/components/layout/header-loading";
import { HomePageSkeleton } from "@/src/modules/dashboard/components/home-page-skeleton";

const Page = () => {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col overflow-y-hidden h-fit justify-start">
        <HeaderLoading />
        <HomePageSkeleton />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
