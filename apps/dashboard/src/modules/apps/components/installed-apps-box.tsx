"use client";

import { useQuery } from "@tanstack/react-query";
import { getInstalledApps } from "../actions/apps.actions";
import Image from "next/image";
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
      <div dir={"rtl"} className="flex flex-col space-y-2 p-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
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

  console.log(data);

  return (
    <div dir={"rtl"} className="flex flex-col space-y-2 p-2">
      {data?.length === 0 ? (
        <span className="text-xs text-gray-400">لا توجد تطبيقات مثبتة</span>
      ) : (
        data?.map((item: any) => (
          <Link key={item.id} href={item.App?.slug}>
            <div className="flex items-center space-x-2 gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1 transition">
              {/* App Icon */}
              {item.App?.logoUrl && (
                <Image
                  src={item.App.logoUrl}
                  alt={item.App.name}
                  width={20}
                  height={20}
                  className="rounded-sm"
                />
              )}
              {/* App Name */}
              <span className="text-sm text-black dark:text-gray-200">
                {item.App?.name}
              </span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
