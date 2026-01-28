"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Copy } from "lucide-react";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Checkbox } from "@ui/components/ui/checkbox";
import { Referral } from "database";
import { maketoast } from "../../toasts";
import { DataTableColumnHeader } from "../table-helpers/data-table-head";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export const useReferralColumns = (): ColumnDef<Referral>[] => {
  const t = useTranslations("affiliateMarketing");
  const locale = useLocale();

  const formatDate = (date: Date) => {
    return format(date, "dd MMMM yyyy", {
      locale: locale === "ar" ? ar : enUS,
    });
  };

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          //@ts-ignore
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="!mr-4"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="!mr-4"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.createdAt")} />
      ),
      cell: ({ row }) => {
        return (
          <p className="text-sm font-bold">
            {formatDate(row.original.createdAt)}
          </p>
        );
      },
    },

    {
      accessorKey: "studentName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.studentName")} />
      ),
    },

    {
      accessorKey: "ccp",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.ccp")} />
      ),
    },

    {
      accessorKey: "numberOfReferredStudents",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.numberOfReferrals")} />
      ),
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const referral = row.original;

        return (
          <div className="w-full h-10 flex items-center justify-end gap-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-10 p-0 bg-card rounded-xl border"
                >
                  <span className="sr-only">{t("actions.openMenu")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(referral.ccp);
                    maketoast.info(t("messages.copied"));
                  }}
                  className="w-full h-full flex items-center gap-2 px-2"
                >
                  <Copy className="h-4 w-4" />
                  {t("actions.copyCcp")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};

// Keep the old export for backward compatibility
export const ReferralColumns = [] as ColumnDef<Referral>[];
