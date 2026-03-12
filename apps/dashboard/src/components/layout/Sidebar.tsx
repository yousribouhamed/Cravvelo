"use client";

import { cn } from "@ui/lib/utils";
import SideBarMenu from "./menu";
import AddNew from "../models/add-new-modal";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const t = useTranslations("sidebar");

  return (
    <div
      className={cn(
        "pb-12 rounded-lg border bg-card text-card-foreground shadow-sm m-2 h-[98%] hidden",
        className
      )}
    >
      <div className="space-y-4 py-2">
        <div className="px-3 pb-2 pt-6">
          <div className="w-full h-[50px] relative">
            <AddNew />
          </div>
          <div className="space-y-2 mt-5">
            <SideBarMenu />
          </div>
          <Link
            href="/settings/subscription"
            className={cn(
              "mt-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/15 dark:hover:bg-primary/20 transition-colors"
            )}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>{t("subscribeToAcceptStudents")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
