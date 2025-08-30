"use client";

import { FC } from "react";
import { Skeleton } from "@ui/components/ui/skeleton";

interface HeaderLoadingProps {
  withBackButton?: boolean;
}

const HeaderLoading: FC<HeaderLoadingProps> = ({ withBackButton = false }) => {
  return (
    <div className="w-full h-[96px] flex justify-between items-center border-b px-4">
      {/* left side */}
      <div className="lg:w-[25%] w-[50%] h-full flex items-center gap-x-3">
        {withBackButton && (
          <Skeleton className="h-10 w-10 rounded-xl" /> /* back button */
        )}
        <Skeleton className="h-6 w-40 rounded-md" /> {/* title */}
      </div>

      {/* middle search */}
      <div className="w-[50%] h-[88px] flex items-center justify-center px-4">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      {/* right side */}
      <div className="lg:w-[25%] w-[50%] h-full flex items-center justify-end gap-x-3">
        <Skeleton className="h-10 w-10 rounded-xl" /> {/* bell */}
        <div className="flex items-center gap-x-3 border rounded-xl px-3 py-2 bg-card">
          <Skeleton className="w-8 h-8 rounded-full" /> {/* avatar */}
          <Skeleton className="w-24 h-4 rounded-md" /> {/* username */}
        </div>
      </div>
    </div>
  );
};

export default HeaderLoading;
