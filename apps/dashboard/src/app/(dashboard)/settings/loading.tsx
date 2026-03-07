import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import HeaderLoading from "@/src/components/layout/header-loading";
import GeneralSettingsHeader from "@/src/modules/settings/components/general-settings-header";
import { Skeleton } from "@ui/components/ui/skeleton";
import { Card, CardContent } from "@ui/components/ui/card";

export default function SettingsLoading() {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <HeaderLoading />

        <GeneralSettingsHeader />

        <div className="flex flex-col gap-4 min-h-[200px] bg-background py-2">
          <Card className="w-full bg-card border border-border">
            <CardContent className="h-[70px] flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-10 w-32 rounded-md" />
            </CardContent>
          </Card>
          <Card className="w-full bg-card border border-border">
            <CardContent className="h-[70px] flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </CardContent>
          </Card>
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
