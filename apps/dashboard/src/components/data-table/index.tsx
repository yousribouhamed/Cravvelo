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
import CouponsTableHeader from "./tables-headers/coupons-table-header";
import SimpleTableHeader from "./tables-headers/simple-table-header";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import StudentTableHeader from "./tables-headers/students-table-header";
import Image from "next/image";
import { Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  refetch?: () => Promise<any>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  refetch,
}: DataTableProps<TData, TValue>) {
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
      <div className="flex items-center py-4   justify-start">
        <div className="w-full max-w-sm  h-[50px] p-4 rounded-xl bg-white border flex items-center justify-start gap-x-4">
          <Search className="text-black w-4 h-4" />
          <input
            className="border-none bg-none focus:border-none focus:ring-0  "
            placeholder="البحث  ..."
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
      {/* <SimpleTableHeader data={data} table={table} /> */}
      <StudentTableHeader data={data} table={table} />
      <div className="rounded-md border bg-white">
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
        <div className="w-full h-[60px] border-t flex items-center justify-start gap-x-6 p-2">
          <Button
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
            onClick={() => table.previousPage()}
            variant="ghost"
          >
            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            سابق
          </Button>

          <Button
            aria-label="Go to next page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            variant="ghost"
          >
            التالي
            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </>
  );
}
