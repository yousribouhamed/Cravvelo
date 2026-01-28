"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Certificate } from "database";
import { DataTableColumnHeader } from "../table-helpers/data-table-head";
import Link from "next/link";
import { useOpenCertificateDeleteAction } from "@/src/lib/zustand/delete-actions";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export const useCertificateColumns = (): ColumnDef<Certificate>[] => {
  const t = useTranslations("certificates");
  const locale = useLocale();

  const formatDate = (date: Date) => {
    return format(date, "dd MMMM yyyy", {
      locale: locale === "ar" ? ar : enUS,
    });
  };

  return [
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.status")} />
      ),
      cell: () => {
        return (
          <div className="flex items-center justify-start gap-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full " />
            <span className="text-gray-700 text-md">{t("columns.success")}</span>
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.createdAt")} />
      ),
      cell: ({ row }) => {
        return (
          <p className=" text-sm font-bold ">
            {formatDate(row.original.createdAt)}
          </p>
        );
      },
    },

    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.certificateName")} />
      ),
    },
    {
      accessorKey: "studentName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.studentName")} />
      ),
    },

    {
      id: "actions",
      cell: ({ row }) => {
        /* eslint-disable */
        const { setId, setIsOpen } = useOpenCertificateDeleteAction();

        return (
          <div className="w-full h-10 flex items-center justify-end gap-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className=" w-10 p-0 bg-white rounded-xl border"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuSeparator />

                <Link target="_blank" href={row.original.fileUrl}>
                  <DropdownMenuItem className="w-full h-full flex justify-between items-center px-2">
                    <ExternalLink className="w-4 h-4 ml-2" />
                    {t("actions.viewCertificate")}
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuItem
                  onClick={() => {
                    setId(row.original.id);
                    setIsOpen(true);
                  }}
                  className="w-full h-full flex justify-between items-center px-2 text-[#C23D2F]"
                >
                  <Trash2 className="w-4 h-4 text-[#C23D2F]" />
                  {t("actions.deleteCertificate")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
