import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { DataTableLoading } from "@/src/components/data-table/table-helpers/table-loading";
import HeaderLoading from "@/src/components/layout/header-loading";
import { Card, CardContent, CardHeader } from "@ui/components/ui/card";
import { Skeleton } from "@ui/components/ui/skeleton";

export default function Loading() {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <HeaderLoading />
        {/* Analytics cards skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 rounded-md mb-2" />
                <Skeleton className="h-3 w-full rounded-md mb-2" />
                <Skeleton className="h-3 w-3/4 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
        <DataTableLoading hideSearch columnCount={6} />
      </main>
    </MaxWidthWrapper>
  );
}
