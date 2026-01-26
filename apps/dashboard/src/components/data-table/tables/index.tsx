"use client";

import {
  ColumnDef,
  flexRender,
  SortingState,
  getSortedRowModel,
  getCoreRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Button } from "@ui/components/ui/button";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/ui/table";
import { ChevronLeftIcon, ChevronRightIcon, Search } from "lucide-react";
import StudentTableHeader from "../tables-headers/students-table-header";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  refetch?: () => Promise<any>;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchColumns?: string[];
}

interface ColumnFilter {
  id: string;
  value: unknown;
}

type TColumnFiltersState = ColumnFilter[];

export function DataTable<TData, TValue>({
  columns,
  data,
  refetch,
  showSearch = false,
  searchPlaceholder,
  searchColumns = [],
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("dataTable");
  const tStudents = useTranslations("students");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
  });

  return (
    <>
      <div className="flex items-center py-4 justify-start gap-x-4 mb-4 flex-wrap">
        {showSearch && (
          <div className="w-full max-w-sm h-[50px] p-4 rounded-xl bg-card border flex items-center justify-start gap-x-4">
            <Search className="text-muted-foreground w-4 h-4" />
            <input
              className="border-none bg-transparent focus:outline-none focus:border-none focus:ring-0 flex-1 text-foreground placeholder:text-muted-foreground"
              placeholder={searchPlaceholder || tStudents("search.placeholder")}
              value={(table.getColumn(searchColumns[0] || "full_name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                table.getAllColumns().forEach((column) => {
                  if (searchColumns.length > 0 && searchColumns.includes(column.id as string)) {
                    column.setFilterValue(value);
                  } else if (searchColumns.length === 0 && ["full_name", "email", "phone"].includes(column.id as string)) {
                    column.setFilterValue(value);
                  }
                });
              }}
            />
          </div>
        )}
        <StudentTableHeader data={data} table={table} setColumnFilters={setColumnFilters} />
      </div>
      <div className="rounded-md border my-4 bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50 dark:bg-muted/30">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      <Button
                        variant="ghost"
                        className="w-full h-[40px] flex justify-start items-center px-0"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </Button>
                    </TableHead>
                  );
                })}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
                  <div className="h-[300px]   flex flex-col justify-center items-center gap-y-1 text-center">
                    <Image
                      src={"/academia/not-found.svg"}
                      alt="this is the error page"
                      width={300}
                      height={300}
                    />
                    {t("noResults")}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className={cn(
          "w-full h-[60px] border-t flex items-center gap-x-6 p-2 bg-card",
          isRTL ? "justify-start" : "justify-end"
        )}>
          <Button
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
            className="rounded-xl border flex items-center gap-x-2"
            onClick={() => table.previousPage()}
            variant="ghost"
          >
            {isRTL ? (
              <>
                <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                {t("previous")}
              </>
            ) : (
              <>
                <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                {t("previous")}
              </>
            )}
          </Button>

          <Button
            aria-label="Go to next page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            variant="ghost"
            className="rounded-xl border flex items-center gap-x-2"
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
    </>
  );
}
