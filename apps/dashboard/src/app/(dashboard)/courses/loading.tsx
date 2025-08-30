"use client";

import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import HeaderLoading from "@/src/components/layout/header-loading";
import { Spinner as CravveloSpinner } from "@geist-ui/core";

const Loading = async ({}) => {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <HeaderLoading />
        <div className="w-full min-h-[400px] h-full flex items-center justify-center">
          <CravveloSpinner />
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default Loading;
