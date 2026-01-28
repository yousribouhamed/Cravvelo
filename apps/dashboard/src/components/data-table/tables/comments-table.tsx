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
import CommentsTableHeader from "../tables-headers/comments-table-header";
import { ChevronRightIcon, ChevronLeftIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  refetch?: () => Promise<any>;
  // Filter callbacks
  onSearchChange?: (value: string) => void;
  onStatusFilterChange?: (values: string[]) => void;
  // Loading state
  isLoading?: boolean;
}

export function CommentsDataTable<TData, TValue>({
  columns,
  data,
  refetch,
  onSearchChange,
  onStatusFilterChange,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("comments");
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
      <CommentsTableHeader
        setColumnFilters={setColumnFilters}
        data={data}
        refetch={refetch}
        table={table}
        onSearchChange={onSearchChange}
        onStatusFilterChange={onStatusFilterChange}
      />
      <div className="rounded-md border bg-card relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
                  className="h-24 text-center"
                >
                  <div className="h-[300px] flex flex-col justify-center items-center gap-y-1 text-center">
                    <Image
                      src={"/academia/not-found.svg"}
                      alt="No results found"
                      width={300}
                      height={300}
                    />
                    {t("emptyState.title")}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="w-full h-[60px] border-t flex items-center justify-between p-2">
          <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
            <span>
              {t("pagination.showing")} {table.getRowModel().rows.length}{" "}
              {t("pagination.of")} {data.length} {t("pagination.results")}
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-muted-foreground">
              {t("pagination.page")}{" "}
              {table.getState().pagination.pageIndex + 1} {t("pagination.of")}{" "}
              {table.getPageCount()}
            </span>
            <Button
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to previous page"
              onClick={() => table.previousPage()}
              className="bg-card rounded-xl border flex items-center gap-x-2"
              variant="ghost"
              size="sm"
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
              {t("pagination.previous")}
            </Button>

            <Button
              aria-label="Go to next page"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="bg-card rounded-xl border flex items-center gap-x-2"
              variant="ghost"
              size="sm"
            >
              {t("pagination.next")}
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
