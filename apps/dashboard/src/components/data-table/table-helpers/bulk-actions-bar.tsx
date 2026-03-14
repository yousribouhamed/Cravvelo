"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@ui/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@ui/lib/utils";

export type BulkAction = {
  label: string;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
};

export type BulkActionDef<TData> = {
  label: string;
  onClick: (selectedRows: TData[]) => void;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
};

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  actions: BulkAction[];
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  actions,
}: BulkActionsBarProps) {
  const t = useTranslations("dataTable.bulkActions");
  const locale = useLocale();
  const isRTL = locale === "ar";

  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-2 px-4 rounded-lg border bg-muted/50 dark:bg-muted/30 mb-4",
        isRTL && "flex-row-reverse"
      )}
    >
      <span className="text-sm font-medium text-foreground">
        {t("selectedCount", { count: selectedCount })}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        className={cn("h-8", isRTL && "flex-row-reverse gap-1")}
        aria-label={t("clearSelection")}
      >
        <X className="h-4 w-4" />
        {t("clearSelection")}
      </Button>
      <div className={cn("flex items-center gap-2 flex-1 justify-end", isRTL && "flex-row-reverse justify-start")}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant={action.variant ?? "default"}
              size="sm"
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn("h-8", isRTL && Icon && "flex-row-reverse gap-1")}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
