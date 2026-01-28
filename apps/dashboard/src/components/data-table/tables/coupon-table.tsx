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
import CouponsTableHeader from "@/src/components/data-table/tables-headers/coupons-table-header";
import { ChevronRightIcon, ChevronLeftIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  refetch?: () => Promise<any>;
  // Server-side pagination props
  pageCount?: number;
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  // Filter callbacks
  onSearchChange?: (value: string) => void;
  onStatusFilterChange?: (values: string[]) => void;
  onDiscountTypeFilterChange?: (values: string[]) => void;
  onCreateCoupon?: () => void;
  // Loading state
  isLoading?: boolean;
  serverSideFiltering?: boolean;
}

export function CouponDataTable<TData, TValue>({
  columns,
  data,
  refetch,
  pageCount = 1,
  totalCount = 0,
  currentPage = 1,
  onPageChange,
  onSearchChange,
  onStatusFilterChange,
  onDiscountTypeFilterChange,
  onCreateCoupon,
  isLoading = false,
  serverSideFiltering = false,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("coupons");
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
    getFilteredRowModel: serverSideFiltering ? undefined : getFilteredRowModel(),
    getPaginationRowModel: serverSideFiltering ? undefined : getPaginationRowModel(),
    manualPagination: serverSideFiltering,
    pageCount: serverSideFiltering ? pageCount : undefined,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      ...(serverSideFiltering && {
        pagination: {
          pageIndex: currentPage - 1,
          pageSize: 10,
        },
      }),
    },
  });

  const canPreviousPage = serverSideFiltering
    ? currentPage > 1
    : table.getCanPreviousPage();
  const canNextPage = serverSideFiltering
    ? currentPage < pageCount
    : table.getCanNextPage();

  const handlePreviousPage = () => {
    if (serverSideFiltering && onPageChange) {
      onPageChange(currentPage - 1);
    } else {
      table.previousPage();
    }
  };

  const handleNextPage = () => {
    if (serverSideFiltering && onPageChange) {
      onPageChange(currentPage + 1);
    } else {
      table.nextPage();
    }
  };

  return (
    <>
      <CouponsTableHeader
        setColumnFilters={setColumnFilters}
        data={data}
        refetch={refetch}
        table={table}
        onSearchChange={onSearchChange}
        onStatusFilterChange={onStatusFilterChange}
        onDiscountTypeFilterChange={onDiscountTypeFilterChange}
        onCreateCoupon={onCreateCoupon}
        serverSideFiltering={serverSideFiltering}
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
            {serverSideFiltering && (
              <span>
                {t("pagination.showing")} {(currentPage - 1) * 10 + 1}{" "}
                {t("pagination.to")}{" "}
                {Math.min(currentPage * 10, totalCount)} {t("pagination.of")}{" "}
                {totalCount} {t("pagination.results")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-x-2">
            {serverSideFiltering && (
              <span className="text-sm text-muted-foreground">
                {t("pagination.page")} {currentPage} {t("pagination.of")}{" "}
                {pageCount}
              </span>
            )}
            <Button
              disabled={!canPreviousPage}
              aria-label="Go to previous page"
              onClick={handlePreviousPage}
              className="bg-card rounded-xl border flex items-center gap-x-2"
              variant="ghost"
              size="sm"
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
              {t("pagination.previous")}
            </Button>

            <Button
              aria-label="Go to next page"
              onClick={handleNextPage}
              disabled={!canNextPage}
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
