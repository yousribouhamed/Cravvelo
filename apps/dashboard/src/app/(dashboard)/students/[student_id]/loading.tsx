import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import HeaderLoading from "@/src/components/layout/header-loading";
import { Card, CardContent, CardHeader } from "@ui/components/ui/card";
import { Skeleton } from "@ui/components/ui/skeleton";

export default function Loading() {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <HeaderLoading withBackButton />
        {/* Tab strip skeleton - matches course header style (yellow underline tabs) */}
        <div className="mt-4 relative w-full overflow-x-auto overflow-y-hidden h-[60px]">
          <div className="flex flex-nowrap gap-0 rounded-lg border border-border bg-card h-[60px] w-full p-0">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-full flex-1 min-w-[4rem] rounded-none"
              />
            ))}
          </div>
        </div>
        {/* Content card skeleton */}
        <Card className="mt-4 w-full border border-border rounded-xl shadow-sm">
          <CardHeader className="space-y-0 pb-2">
            <Skeleton className="h-6 w-48 rounded-md" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="h-[300px] w-full md:w-[300px] rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-4 w-28 rounded-md flex-shrink-0" />
                    <Skeleton className="h-4 flex-1 max-w-[200px] rounded-md" />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-6 border-t space-y-4">
              <Skeleton className="h-5 w-36 rounded-md" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </MaxWidthWrapper>
  );
}
