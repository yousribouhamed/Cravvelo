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
import TableHeader2 from "@/src/components/data-table/tables-headers/course-table-header";
import React, { ChangeEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/ui/table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Search,
  Trash2,
} from "lucide-react";
import { DataTableFilterableColumn } from "@/src/types";
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
import { deleteCourseAction } from "@/src/actions/courses.actions";
import { maketoast } from "../../toasts";

import { getLangCookie } from "@cravvelo/i18n";

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
  // get the data from the cookie

  const lang = getLangCookie();

  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [isDeleteButtonLoading, setIsDeleteButtonLoading] =
    React.useState<boolean>(false);

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

  const deleteAllCourses = async () => {
    setIsDeleteButtonLoading(true);
    try {
      await Promise.all(
        table
          .getFilteredSelectedRowModel()

          .rows.map((item) =>
            deleteCourseAction({
              //@ts-ignore
              courseId: item.original?.id,
              //@ts-ignore
              imageurl: item.original?.thumbnailUrl ?? null,
            })
          )
      );
      setIsDeleteButtonLoading(false);
      maketoast.success();
      table.reset();
    } catch (err) {
      setIsDeleteButtonLoading(false);
      console.error(err);
      maketoast.error();
    }
  };

  return (
    <>
      <div className="flex items-center py-4   justify-start">
        <div className="w-full max-w-sm  h-12 p-4 rounded-xl bg-white border flex items-center justify-start gap-x-4">
          <Search className="text-[#303030] w-4 h-4" />
          <input
            className="border-none bg-none  focus:outline-none focus:border-none focus:ring-0  "
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
                    {lang === "en"
                      ? "we can't find anything"
                      : "     لم يتم العثور على نتائج"}
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
            className="bg-white rounded-xl border flex items-center gap-x-2"
            variant="ghost"
          >
            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            سابق
          </Button>

          <Button
            aria-label="Go to next page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-white rounded-xl border flex items-center gap-x-2"
            variant="ghost"
          >
            {lang === "en" ? (
              <>
                <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                {lang === "en" ? "next" : "التالي"}
              </>
            ) : (
              <>
                {lang === "en" ? "next" : "التالي"}

                <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      </div>
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="flex-1 w-[500px] h-[50px] mx-auto  text-sm text-muted-foreground absolute bottom-10 right-[40%] bg-primary rounded-2xl shadow flex items-center justify-between px-4">
          <span className="text-white text-lg  text-start mx-2">
            <span className="mx-1">
              {" "}
              تم اختيار {table.getFilteredSelectedRowModel().rows.length}
            </span>
            صفوف من اصل {table.getFilteredRowModel().rows.length}
          </span>

          <Button
            onClick={deleteAllCourses}
            variant="secondary"
            className="text-black bg-white"
            disabled={isDeleteButtonLoading}
          >
            {isDeleteButtonLoading ? (
              <>جاري الحذف ...</>
            ) : (
              <>
                <Trash2 className="w-5 h-5 mx-2" />
                حذف الكل
              </>
            )}
          </Button>
        </div>
      )}
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

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilter<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);
  const lang = getLangCookie();

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
            <CommandEmpty>
              {lang === "en"
                ? "we havn't find anything lol"
                : "      لم يتم العثور على نتائج."}
            </CommandEmpty>
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
