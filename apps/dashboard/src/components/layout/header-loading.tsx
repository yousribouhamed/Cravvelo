"use client";

import { FC } from "react";
import { Skeleton } from "@ui/components/ui/skeleton";

interface HeaderLoadingProps {
  withBackButton?: boolean;
}

const HeaderLoading: FC<HeaderLoadingProps> = ({ withBackButton = false }) => {
  return (
    <div className="w-full h-16 md:h-20 flex justify-between items-center px-4">
      {/* left side: mobile sidebar + back + title */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 flex-1">
        {withBackButton && (
          <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-md shrink-0" />
        )}
        <Skeleton className="h-5 w-40 rounded-md shrink-0" />
      </div>

      {/* right side: search, notifications, user nav */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Skeleton className="hidden lg:block h-10 w-48 rounded-xl" />
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="flex items-center gap-x-3 border rounded-xl px-3 py-2 bg-card">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-24 h-4 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default HeaderLoading;
