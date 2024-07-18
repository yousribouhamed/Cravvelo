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
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import { Button } from "@ui/components/ui/button";
import TableHeader2, { statuses } from "./table-header";
import React, { ChangeEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/ui/table";
import { ChevronRightIcon, Search } from "lucide-react";
import { DataTableFilterableColumn } from "@/src/types";
import { ArrowLeftIcon } from "lucide-react";
import { cn } from "@ui/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@ui/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import { Separator } from "@ui/components/ui/separator";
import { Badge } from "@ui/components/ui/badge";
import { Column } from "@tanstack/react-table";
import { Check, LucideIcon, PlusCircle } from "lucide-react";
import { Pencil, ArrowUpCircle } from "lucide-react";
import Image from "next/image";

export const levels = [
  {
    label: "مبتدئ",
    value: "BIGENNER",
    icon: Pencil,
  },
  {
    label: "متوسط",
    value: "ADVANCED",

    icon: ArrowUpCircle,
  },
  {
    label: "متقدم",
    value: "ADVANCED",
    icon: ArrowUpCircle,
  },
];

const includesString = (row, columnId, filterValue) => {
  if (typeof filterValue !== "string") {
    return false;
  }
  const rowValue = row.getValue(columnId);
  return String(rowValue).toLowerCase().includes(filterValue.toLowerCase());
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  filterableColumns?: DataTableFilterableColumn<TData>[];
  data: TData[];
  academia_url: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,

  academia_url,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  ); // can set initial column filter state here

  const table = useReactTable({
    data,

    columns,

    state: {
      sorting,
      rowSelection,
      columnFilters,
    },

    initialState: {
      columnFilters: [],
    },
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  console.log("this is the table coirse");
  console.log({ columnFilters: table.getState().columnFilters }); // access the column filters state from the table instance

  return (
    <>
      <div className="flex items-center py-4   justify-start">
        <div className="w-full max-w-sm  h-[50px] p-4 rounded-xl bg-white border flex items-center justify-start gap-x-4">
          <Search className="text-black w-4 h-4" />
          <input
            className="border-none bg-none  focus:outline-none focus:border-none focus:ring-0  "
            placeholder="البحث عن الدورات..."
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

      <TableHeader2
        setColumnFilters={setColumnFilters}
        data={data}
        academia_url={academia_url}
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
            {table?.getRowModel().rows?.length ? (
              table?.getRowModel().rows.map((row) => (
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
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </>
  );
}

interface DataTableFacetedFilter<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: LucideIcon;
  }[];
}

{
  /* <svg
width="18"
height="18"
viewBox="0 0 18 18"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M8.93189 2.57251C10.8467 2.57251 12.7232 2.73376 14.5497 3.04373C14.9201 3.10628 15.187 3.43016 15.187 3.80547V4.53106C15.187 4.73642 15.1466 4.93977 15.068 5.1295C14.9894 5.31923 14.8742 5.49162 14.729 5.63683L10.9537 9.41215C10.8085 9.55736 10.6933 9.72975 10.6147 9.91948C10.5361 10.1092 10.4957 10.3126 10.4957 10.5179V12.5522C10.4957 12.8427 10.4149 13.1275 10.2621 13.3746C10.1094 13.6217 9.89091 13.8214 9.63107 13.9513L7.3681 15.0828V10.5179C7.36811 10.3126 7.32766 10.1092 7.24907 9.91948C7.17049 9.72975 7.0553 9.55736 6.91009 9.41215L3.13477 5.63683C2.98956 5.49162 2.87438 5.31923 2.79579 5.1295C2.7172 4.93977 2.67676 4.73642 2.67676 4.53106V3.80547C2.67676 3.43016 2.94364 3.10628 3.31409 3.04373C5.17017 2.72948 7.04939 2.57185 8.93189 2.57251Z"
  stroke="black"
  stroke-width="1.04252"
  stroke-linecap="round"
  stroke-linejoin="round"
/>
</svg> */
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilter<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="bg-white rounded-xl border flex items-center gap-x-2"
        >
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                color="indigo"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex gap-x-2">
                {selectedValues.size > 2 ? (
                  <Badge
                    color="blue"
                    className="rounded-sm px-1 font-normal bg-black text-white"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        key={option.value}
                        className="rounded-sm px-1 font-normal bg-black text-white"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );

                      column.setFilterValue;
                    }}
                  >
                    <div
                      className={cn(
                        "ml-2 flex h-4 w-4 items-center justify-center rounded-sm border border-black",
                        isSelected
                          ? "bg-black text-white"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    {option.icon && (
                      <option.icon className="ml-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center bg-black text-white"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
