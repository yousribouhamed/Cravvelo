"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronsUpDown,
  MoreHorizontal,
  Users,
} from "lucide-react";
import { Button, buttonVariants } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Checkbox } from "@ui/components/ui/checkbox";
import Link from "next/link";
import { DataTableColumnHeader } from "../table-helpers/data-table-head";
import { Product } from "database";
import { Badge } from "@ui/components/ui/badge";
import { maketoast } from "../../toasts";
import { useOpenProductDeleteAction } from "@/src/lib/zustand/delete-actions";
import { timeSince } from "@/src/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useCurrency } from "@/src/hooks/use-currency";

export const useProductsColumns = (): ColumnDef<Product>[] => {
  const t = useTranslations("products");
  const { formatPrice } = useCurrency();
  const locale = useLocale();
  const isRTL = locale === "ar";

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
    id: "title",
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("columns.title")} />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      const statusKey = status === "DRAFT" 
        ? "draft" 
        : status === "PUBLISHED" || status === "PUBLISED"
        ? "published"
        : "private";
      
      return (
        <div className="flex flex-col gap-y-2 justify-center items-start ">
          <Link href={`/products/${row.original.id}/content`}>
            <p className="font-bold hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer text-foreground">
              {row.original.title}
            </p>
          </Link>

          <Badge className="bg-muted hover:bg-muted text-muted-foreground rounded-md">
            {t(`status.${statusKey}`)}
          </Badge>
        </div>
      );
    },
    filterFn: "includesString",
  },
  {
    id: "price",
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("columns.price")} />
    ),
    cell: ({ row }) => {
      return formatPrice(row.original.price === null ? 0 : row.original.price);
    },
    filterFn: "inNumberRange",
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("columns.createdAt")} />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-foreground">{timeSince(row.original.createdAt, t)}</p>
      );
    },
    filterFn: "includesString",
  },

  {
    id: "numberOfDownloads",
    accessorKey: "numberOfDownloads",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("columns.numberOfDownloads")} />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <p className="text-foreground">
            {row.original.numberOfDownloads === null
              ? 0
              : row.original.numberOfDownloads}
          </p>
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const { setId, setIsOpen } = useOpenProductDeleteAction();

      return (
        <div className="w-full h-10 flex items-center justify-end gap-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="w-10 p-0 bg-card rounded-xl border"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "end" : "start"} dir={isRTL ? "rtl" : "ltr"}>
              <Link href={`/products/${row.original.id}/content`}>
                <DropdownMenuItem className="w-full h-full flex justify-between items-center px-2">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.2413 3.49125L12.366 2.36592C12.6005 2.13147 12.9184 1.99976 13.25 1.99976C13.5816 1.99976 13.8995 2.13147 14.134 2.36592C14.3685 2.60037 14.5002 2.91836 14.5002 3.24992C14.5002 3.58149 14.3685 3.89947 14.134 4.13392L7.05467 11.2133C6.70222 11.5655 6.26758 11.8244 5.79 11.9666L4 12.4999L4.53333 10.7099C4.67552 10.2323 4.93442 9.7977 5.28667 9.44525L11.2413 3.49125ZM11.2413 3.49125L13 5.24992M12 9.83325V12.9999C12 13.3977 11.842 13.7793 11.5607 14.0606C11.2794 14.3419 10.8978 14.4999 10.5 14.4999H3.5C3.10218 14.4999 2.72064 14.3419 2.43934 14.0606C2.15804 13.7793 2 13.3977 2 12.9999V5.99992C2 5.6021 2.15804 5.22057 2.43934 4.93926C2.72064 4.65796 3.10218 4.49992 3.5 4.49992H6.66667"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t("actions.edit")}
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  setId(row.original.id);
                  setIsOpen(true);
                }}
                className="w-full h-full flex justify-between items-center px-2 text-[#C23D2F]"
              >
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.82667 6.5001L9.596 12.5001M6.404 12.5001L6.17333 6.5001M12.8187 4.3601C13.0467 4.39477 13.2733 4.43144 13.5 4.47077M12.8187 4.3601L12.1067 13.6154C12.0776 13.9923 11.9074 14.3442 11.63 14.6009C11.3527 14.8577 10.9886 15.0002 10.6107 15.0001H5.38933C5.0114 15.0002 4.64735 14.8577 4.36999 14.6009C4.09262 14.3442 3.92239 13.9923 3.89333 13.6154L3.18133 4.3601M12.8187 4.3601C12.0492 4.24378 11.2758 4.1555 10.5 4.09544M3.18133 4.3601C2.95333 4.3941 2.72667 4.43077 2.5 4.4701M3.18133 4.3601C3.95076 4.24378 4.72416 4.1555 5.5 4.09544M10.5 4.09544V3.48477C10.5 2.6981 9.89333 2.0421 9.10667 2.01744C8.36908 1.99386 7.63092 1.99386 6.89333 2.01744C6.10667 2.0421 5.5 2.69877 5.5 3.48477V4.09544M10.5 4.09544C8.83581 3.96682 7.16419 3.96682 5.5 4.09544"
                    stroke="#C23D2F"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t("actions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
  ];
};
