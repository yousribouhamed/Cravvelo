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
import CoursesTableHeader from "../tables-headers/courses-table-header";
import ProductsTableHeader from "../tables-headers/products-table-header";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";
import AddCourse from "@/src/components/models/create-course-modal";
import AddProduct from "@/src/components/models/create-product-modal";
import { Loader } from "@/src/components/loader-icon";
import { BulkActionsBar, type BulkAction, type BulkActionDef } from "../table-helpers/bulk-actions-bar";

export type { BulkActionDef } from "../table-helpers/bulk-actions-bar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  refetch?: () => Promise<any>;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchColumns?: string[];
  tableType?: "students" | "courses" | "products";
  onSearchChange?: (value: string) => void;
  onStatusFilterChange?: (values: string[]) => void;
  onLevelFilterChange?: (values: string[]) => void;
  serverSideFiltering?: boolean;
  isLoading?: boolean;
  // Server-side pagination (when provided, overrides client pagination)
  pageCount?: number;
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  /** Controlled search value for server-side search (e.g. students table) */
  searchValue?: string;
  /** Bulk actions shown when one or more rows are selected */
  bulkActions?: BulkActionDef<TData>[];
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
  tableType = "students",
  onSearchChange,
  onStatusFilterChange,
  onLevelFilterChange,
  serverSideFiltering = false,
  isLoading = false,
  pageCount,
  totalCount = 0,
  currentPage = 1,
  onPageChange,
  pageSize = 10,
  searchValue: controlledSearchValue,
  bulkActions,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("dataTable");
  const tStudents = useTranslations("students");
  const tCourses = useTranslations("courses");
  const tProducts = useTranslations("products");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [internalSearchValue, setInternalSearchValue] = React.useState("");
  const searchValue = controlledSearchValue ?? internalSearchValue;
  const setSearchValue = (v: string) => {
    if (controlledSearchValue === undefined) setInternalSearchValue(v);
    else if (onSearchChange) onSearchChange(v);
  };

  const serverSidePagination = Boolean(onPageChange && pageCount != null);

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => (row as { id: string }).id,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: serverSideFiltering && (tableType === "courses" || tableType === "products") ? undefined : getFilteredRowModel(),
    getPaginationRowModel: serverSidePagination ? undefined : getPaginationRowModel(),
    manualPagination: serverSidePagination,
    pageCount: serverSidePagination ? pageCount : undefined,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      ...(serverSidePagination && {
        pagination: {
          pageIndex: currentPage - 1,
          pageSize,
        },
      }),
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

  const canPreviousPage = serverSidePagination ? currentPage > 1 : table.getCanPreviousPage();
  const canNextPage = serverSidePagination ? (currentPage < (pageCount ?? 1)) : table.getCanNextPage();
  const handlePreviousPage = () => {
    if (serverSidePagination && onPageChange) onPageChange(currentPage - 1);
    else table.previousPage();
  };
  const handleNextPage = () => {
    if (serverSidePagination && onPageChange) onPageChange(currentPage + 1);
    else table.nextPage();
  };

  return (
    <>
      <div className="flex items-center py-4 justify-start gap-x-4 mb-4 flex-wrap">
        {showSearch && (
          <div className="w-full max-w-sm h-[50px] p-4 rounded-xl bg-card border flex items-center justify-start gap-x-4">
            <Search className="text-muted-foreground w-4 h-4" />
            <input
              className="border-none bg-transparent focus:outline-none focus:border-none focus:ring-0 flex-1 text-foreground placeholder:text-muted-foreground"
              placeholder={searchPlaceholder || (tableType === "courses" ? tCourses("search.placeholder") : tableType === "products" ? tProducts("search.placeholder") : tStudents("search.placeholder"))}
              value={serverSideFiltering && (tableType === "courses" || tableType === "products") ? searchValue : serverSidePagination && tableType === "students" ? searchValue : (table.getColumn(searchColumns[0] || (tableType === "courses" || tableType === "products" ? "title" : "full_name"))?.getFilterValue() as string) ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                if (serverSideFiltering && (tableType === "courses" || tableType === "products")) {
                  setInternalSearchValue(value);
                  if (onSearchChange) onSearchChange(value);
                } else if (serverSidePagination && tableType === "students" && onSearchChange) {
                  setSearchValue(value);
                } else {
                  table.getAllColumns().forEach((column) => {
                    if (searchColumns.length > 0 && searchColumns.includes(column.id as string)) {
                      column.setFilterValue(value);
                    } else if (searchColumns.length === 0 && ["full_name", "email", "phone"].includes(column.id as string)) {
                      column.setFilterValue(value);
                    }
                  });
                }
              }}
            />
          </div>
        )}
        {tableType === "courses" ? (
          <>
            <CoursesTableHeader 
              data={data} 
              table={table} 
              setColumnFilters={setColumnFilters}
              onStatusFilterChange={onStatusFilterChange}
              onLevelFilterChange={onLevelFilterChange}
              serverSideFiltering={serverSideFiltering}
            />
            <div className="ml-auto">
              <AddCourse />
            </div>
          </>
        ) : tableType === "products" ? (
          <>
            <ProductsTableHeader 
              data={data} 
              table={table} 
              setColumnFilters={setColumnFilters}
              onStatusFilterChange={onStatusFilterChange}
              serverSideFiltering={serverSideFiltering}
            />
            <div className="ml-auto">
              <AddProduct />
            </div>
          </>
        ) : (
          <StudentTableHeader data={data} table={table} setColumnFilters={setColumnFilters} />
        )}
      </div>
      {selectedCount > 0 && (
        <BulkActionsBar
          selectedCount={selectedCount}
          onClearSelection={() => setRowSelection({})}
          actions={barActions}
        />
      )}
      <div className="rounded-md border my-4 bg-card text-card-foreground shadow-sm relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20 rounded-md">
            <Loader size={20} />
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50 dark:bg-muted/30">
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
          "w-full h-[60px] border-t flex items-center gap-x-2 p-2 bg-card",
          isRTL ? "justify-start" : "justify-end"
        )}>
          <Button
            disabled={!canPreviousPage}
            aria-label="Go to previous page"
            className="rounded-xl border flex items-center gap-x-2"
            onClick={handlePreviousPage}
            variant="ghost"
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
            aria-label="Go to next page"
            onClick={handleNextPage}
            disabled={!canNextPage}
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
