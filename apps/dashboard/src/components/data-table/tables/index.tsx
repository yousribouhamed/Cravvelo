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
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import StudentTableHeader from "../tables-headers/students-table-header";
import Image from "next/image";
import { Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  refetch?: () => Promise<any>;
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

  console.log("this is the table coirse");
  console.log({ columnFilters: table.getState().columnFilters }); // access the column filters state from the table instance

  return (
    <>
      {/* <SimpleTableHeader data={data} table={table} /> */}
      {/* <StudentTableHeader data={data} table={table} /> */}
      <div className="rounded-md border my-4 bg-white">
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
            className="bg-white rounded-xl border flex items-center gap-x-2"
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
            className="bg-white rounded-xl border flex items-center gap-x-2"
          >
            التالي
            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </>
  );
}
