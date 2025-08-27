import { Card } from "@ui/components/ui/card";
import { Skeleton } from "@ui/components/ui/skeleton";

export default function AppCardSkeleton() {
  return (
    <Card className="w-full rounded-2xl shadow-sm border p-4" dir="rtl">
      {/* header: icon + name/mini meta */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* short description */}
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[90%]" />
        <Skeleton className="h-3 w-[70%]" />
      </div>

      {/* footer button */}
      <div className="mt-4 flex justify-between items-center">
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </Card>
  );
}
