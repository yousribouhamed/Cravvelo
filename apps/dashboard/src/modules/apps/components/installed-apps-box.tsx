"use client";

import { useQuery } from "@tanstack/react-query";
import { getInstalledApps } from "../actions/apps.actions";
import { Skeleton } from "@ui/components/ui/skeleton";
import Link from "next/link";

interface InstalledAppsBoxProps {}

export default function InstalledAppsBox({}: InstalledAppsBoxProps) {
  // React Query fetching
  const { data, isLoading, isError } = useQuery({
    queryKey: ["installedApps"],
    queryFn: async () => {
      const res = await getInstalledApps();
      return res.data; // list of installed apps
    },
  });

  if (isLoading) {
    return (
      <div dir={"rtl"} className="p-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div dir={"rtl"} className="text-red-500 text-sm p-2">
        فشل تحميل التطبيقات المثبتة
      </div>
    );
  }

  // Filter only ACTIVE installations (server already filters, but double-check for safety)
  const activeApps = data?.filter(
    (item: any) => item.status === "ACTIVE"
  ) || [];

  // Debug: Log to check data structure (remove in production)
  if (activeApps.length > 0 && process.env.NODE_ENV === "development") {
    console.log("Installed apps data:", activeApps);
  }

  return (
    <div dir={"rtl"} className="flex flex-col space-y-2 p-2">
      {activeApps.length === 0 ? (
        <span className="text-xs text-gray-400">لا توجد تطبيقات مثبتة</span>
      ) : (
        activeApps
          .filter((item: any) => item.App) // Only show apps where App relation exists
          .map((item: any) => (
            <Link key={item.id} href={item.App?.slug || "#"}>
              <div className="flex items-center space-x-2 gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1 transition">
                {/* App Icon */}
                <div className="relative w-5 h-5 flex-shrink-0">
                  {item.App?.logoUrl ? (
                    <img
                      src={item.App.logoUrl}
                      alt={item.App.name || "App icon"}
                      className="rounded-sm object-cover w-full h-full"
                      onError={(e) => {
                        // Replace with fallback if image fails to load
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}
                  {/* Fallback icon if logoUrl is missing or image fails to load */}
                  <div
                    className="w-full h-full rounded-sm bg-gray-300 dark:bg-gray-600 flex items-center justify-center"
                    style={{ display: item.App?.logoUrl ? "none" : "flex" }}
                  >
                    <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium">
                      {item.App?.name?.[0]?.toUpperCase() || "?"}
                    </span>
                  </div>
                </div>
                {/* App Name */}
                <span className="text-sm text-black dark:text-gray-200">
                  {item.App?.name || "Unknown App"}
                </span>
              </div>
            </Link>
          ))
      )}
    </div>
  );
}
