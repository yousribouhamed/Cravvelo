"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@ui/components/ui/card";
import { Skeleton } from "@ui/components/ui/skeleton";
import { StatsCard, StatsGrid } from "@/src/components/stats-card";

export function HomePageSkeleton() {
  return (
    <div className="space-y-6 max-w-full my-4 mx-auto">
      {/* Date picker row */}
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-10 w-16 rounded-lg" />
        <Skeleton className="h-10 w-12 rounded-lg" />
        <Skeleton className="h-10 w-12 rounded-lg" />
        <Skeleton className="h-10 w-12 rounded-lg" />
        <Skeleton className="h-10 w-12 rounded-lg" />
        <Skeleton className="h-10 w-12 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Four metric cards */}
      <StatsGrid>
        <StatsCard title="" value="" isLoading />
        <StatsCard title="" value="" isLoading />
        <StatsCard title="" value="" isLoading />
        <StatsCard title="" value="" isLoading />
      </StatsGrid>

      {/* Revenue Overview card */}
      <Card className="border border-gray-200 dark:border-border bg-card">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <Skeleton className="h-64 sm:h-80 w-full rounded-md" />
        </CardContent>
      </Card>

      {/* Today vs Yesterday */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200 dark:border-border bg-card">
          <CardHeader className="pb-2 px-4 sm:px-6">
            <Skeleton className="h-4 w-16 rounded-md" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4">
            <Skeleton className="h-8 w-24 rounded-md mb-4" />
            <Skeleton className="h-16 w-full rounded-md" />
          </CardContent>
        </Card>
        <Card className="border border-gray-200 dark:border-border bg-card">
          <CardHeader className="pb-2 px-4 sm:px-6">
            <Skeleton className="h-4 w-20 rounded-md" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4">
            <Skeleton className="h-8 w-24 rounded-md mb-4" />
            <Skeleton className="h-16 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
