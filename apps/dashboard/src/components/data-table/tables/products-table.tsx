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
import ProductsTableHeader from "../tables-headers/products-table-header";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";
import { BulkActionsBar, type BulkAction, type BulkActionDef } from "../table-helpers/bulk-actions-bar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  bulkActions?: BulkActionDef<TData>[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  bulkActions,
}: DataTableProps<TData, TValue>) {
  const tDataTable = useTranslations("dataTable");
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
    getRowId: (row) => (row as { id: string }).id,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
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
      <div className="flex items-center py-4   justify-start">
        <div className="w-full max-w-sm  h-[50px] p-4 rounded-xl bg-white border flex items-center justify-start gap-x-4">
          <Search className="text-black w-4 h-4" />
          <input
            className="border-none bg-none  focus:outline-none focus:border-none focus:ring-0  "
            placeholder="البحث عن المنتجات..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={
              (event) => {
                const value = event.target.value;

                table.getAllColumns().forEach((column) => {
                  if (
                    ["title", "description", "category"].includes(
                      column.id as string
                    )
                  ) {
                    column.setFilterValue(value); // Adjust this line based on your filtering logic
                  }
                });
              }
              // table.getColumn("title")?.setFilterValue(event.target.value)
            }
          />
        </div>
      </div>

      <ProductsTableHeader
        setColumnFilters={setColumnFilters}
        data={data}
        table={table}
      />
      <div className="rounded-md border bg-white">
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
                      alt="this is the error page"
                      width={300}
                      height={300}
                    />
                    لم يتم العثور على نتائج
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className={cn(
        "w-full h-[60px] border-t flex items-center gap-x-2 p-2",
        isRTL ? "justify-start" : "justify-end"
      )}>
        <Button
          disabled={!table.getCanPreviousPage()}
          aria-label="Go to previous page"
          onClick={() => table.previousPage()}
          variant="ghost"
          className="bg-white rounded-xl border flex items-center gap-x-2"
        >
          {isRTL ? (
            <>
              {tDataTable("previous")}
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            <>
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
              {tDataTable("previous")}
            </>
          )}
        </Button>

        <Button
          aria-label="Go to next page"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          variant="ghost"
          className="bg-white rounded-xl border flex items-center gap-x-2"
        >
          {isRTL ? (
            <>
              {tDataTable("next")}
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            <>
              {tDataTable("next")}
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </>
  );
}
