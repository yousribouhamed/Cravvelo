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
import { ChevronRightIcon } from "lucide-react";
import { ChevronLeftIcon } from "lucide-react";
import CertificateTableHeader from "../tables-headers/certificates-table-header";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";
import { BulkActionsBar, type BulkAction, type BulkActionDef } from "../table-helpers/bulk-actions-bar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  refetch?: () => Promise<any>;
  bulkActions?: BulkActionDef<TData>[];
}

export function CertificateDataTable<TData, TValue>({
  columns,
  data,
  refetch,
  bulkActions,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("certificates");
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => (row as { id: string }).id,
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

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
  const selectedCount = selectedRows.length;
  const barActions: BulkAction[] =
    bulkActions?.map((ba) => ({
      label: ba.label,
      onClick: () => ba.onClick(selectedRows),
      icon: ba.icon,
      variant: ba.variant,
      disabled: ba.disabled,
    })) ?? [];

  return (
    <>
      {selectedCount > 0 && (
        <BulkActionsBar
          selectedCount={selectedCount}
          onClearSelection={() => setRowSelection({})}
          actions={barActions}
        />
      )}
      <CertificateTableHeader data={data} refetch={refetch} table={table} />
      <div className="rounded-md border bg-card text-card-foreground overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      <div className="w-full h-[40px] flex justify-start items-center px-0">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
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
                  <div className="h-[300px]   flex flex-col justify-center items-center gap-y-1 text-center">
                    <Image
                      src={"/academia/not-found.svg"}
                      alt="No results found"
                      width={300}
                      height={300}
                    />
                    {t("table.noResults")}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className={cn(
          "w-full min-h-[60px] border-t flex items-center gap-x-2 p-2 bg-card",
          isRTL ? "justify-start" : "justify-end"
        )}>
          <Button
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
            onClick={() => table.previousPage()}
            className="bg-card rounded-xl border flex items-center gap-x-2"
            variant="ghost"
          >
            {isRTL ? (
              <>
                {t("table.previous")}
                <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
              </>
            ) : (
              <>
                <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                {t("table.previous")}
              </>
            )}
          </Button>

          <Button
            aria-label="Go to next page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-card rounded-xl border flex items-center gap-x-2"
            variant="ghost"
          >
            {isRTL ? (
              <>
                {t("table.next")}
                <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
              </>
            ) : (
              <>
                {t("table.next")}
                <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
