"use client";

import { AppType } from "../types";
import { Card, CardContent } from "@ui/components/ui/card";
import InstallAppModal from "./install-app-modal";
import UninstallAppModal from "./uninstall-app-modal";
import { useQuery } from "@tanstack/react-query";
import { getInstalledApps } from "../actions/apps.actions";
import { Button } from "@ui/components/ui/button";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

interface Props {
  app: AppType;
}

export default function AppCard({ app }: Props) {
  const t = useTranslations("apps");
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Fetch installed apps to check if this app is installed
  const { data: installedApps } = useQuery({
    queryKey: ["installedApps"],
    queryFn: async () => {
      const res = await getInstalledApps();
      return res.data || [];
    },
  });

  // Check if current app is installed (status ACTIVE)
  const isInstalled = installedApps?.some(
    (install: any) => install.appId === app.id && install.status === "ACTIVE"
  );

  // Get the installation to access app slug if needed
  const installation = installedApps?.find(
    (install: any) => install.appId === app.id && install.status === "ACTIVE"
  );

  return (
    <Card
      className="w-full h-[200px] rounded-xl shadow border flex flex-col  p-4 gap-3"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-between w-full justify-between gap-3">
        <div className="flex items-start gap-x-2">
          <img
            src={app.logoUrl ?? "/placeholder.png"}
            alt={app.name}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">{app.name}</h2>
            <span className="text-xs text-gray-500">
              {app.installsCount.toLocaleString()} {t("installs")}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {isInstalled ? (
            <>
              <Link href={app.slug}>
                <Button size="sm">{t("goToApp")}</Button>
              </Link>
              <UninstallAppModal appId={app.id} />
            </>
          ) : (
            <InstallAppModal appId={app.id} />
          )}
        </div>
      </div>

      <CardContent className="p-0 text-lg text-gray-700 dark:text-gray-50">
        {app.shortDesc}
      </CardContent>
    </Card>
  );
}
