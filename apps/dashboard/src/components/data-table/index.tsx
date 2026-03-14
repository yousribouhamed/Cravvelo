"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/ui/table";
import { Button } from "@ui/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("dataTable");
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-muted/50 dark:bg-muted/30"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "text-sm font-medium text-foreground dark:text-gray-200",
                    isRTL ? "text-right" : "text-left"
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {t("noResults")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className={cn(
        "w-full h-[60px] border-t flex items-center gap-x-2 p-2 bg-card",
        isRTL ? "justify-start" : "justify-end"
      )}>
        <Button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          variant="ghost"
          className="rounded-xl border flex items-center gap-x-2"
          aria-label="Go to previous page"
        >
          {isRTL ? (
            <>
              {t("previous")}
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            <>
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
              {t("previous")}
            </>
          )}
        </Button>
        <Button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          variant="ghost"
          className="rounded-xl border flex items-center gap-x-2"
          aria-label="Go to next page"
        >
          {isRTL ? (
            <>
              {t("next")}
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            <>
              {t("next")}
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
