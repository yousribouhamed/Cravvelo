"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetFooter, SheetHeader } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "next-intl";

export function PaymentSheetSkeleton() {
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const isRTL = locale === "ar";

  return (
    <div className="h-full flex flex-col min-h-0" dir={dir}>
      <SheetHeader
        className={`pb-6 flex-shrink-0 ${isRTL ? "text-right" : "text-left"}`}
      >
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </SheetHeader>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Summary Skeleton - right in LTR, left in RTL */}
              <div
                className={`lg:sticky lg:top-0 ${isRTL ? "lg:order-1" : "lg:order-2"}`}
              >
                <div dir={dir} className="space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-16 h-16 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-1 space-y-2 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                      <Skeleton className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods & Form Skeleton - left in LTR, right in RTL */}
              <div
                className={`space-y-6 col-span-2 ${isRTL ? "lg:order-2" : "lg:order-1"}`}
                dir={dir}
              >
                <div className="space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <Skeleton className="w-5 h-5 rounded-full" />
                          <Skeleton className="w-8 h-8" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <div className="space-y-4 bg-muted/50 rounded-lg p-4 border">
                    <Skeleton className="h-4 w-48" />
                    <div className="space-y-4">
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      <SheetFooter className="sticky bottom-0 z-10 bg-card pt-4 pb-[env(safe-area-inset-bottom)] md:static md:pt-6 border-t mt-4 flex-shrink-0">
        <div className="w-full space-y-3 p-4">
          <Skeleton className="w-full h-11" />
        </div>
      </SheetFooter>
    </div>
  );
}
