"use client";

import { Skeleton } from "@ui/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/ui/table";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

interface DataTableLoadingProps {
  columnCount: number;
  rowCount?: number;
  hideSearch?: boolean;
}

export function DataTableLoading({
  columnCount,
  rowCount = 10,
  hideSearch = false,
}: DataTableLoadingProps) {
  const t = useTranslations("dataTable");

  return (
    <>
      {/* Toolbar: only when search is shown (matches enhanced DataTable with search + filters) */}
      {!hideSearch && (
        <div className="flex items-center py-4 justify-start gap-x-4 mb-4 flex-wrap">
          <div className="w-full max-w-sm h-[50px] p-4 rounded-xl bg-card border flex items-center justify-start gap-x-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              className="border-none bg-transparent focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground flex-1 min-w-0"
              placeholder={t("searchPlaceholder")}
              readOnly
              aria-hidden
            />
          </div>
          <div className="flex items-center justify-start gap-x-4">
            <Skeleton className="h-10 w-[120px] rounded-xl" />
            <Skeleton className="h-10 w-[120px] rounded-xl" />
          </div>
          <div className="ml-auto">
            <Skeleton className="h-10 w-[100px] rounded-xl" />
          </div>
        </div>
      )}

      {/* Table wrapper matching enhanced DataTable: rounded-md border my-4 bg-card shadow-sm */}
      <div className="rounded-md border my-4 bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 dark:bg-muted/30 hover:bg-muted/50">
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableHead key={i} className="h-[40px] px-4">
                  <Skeleton className="h-5 w-full max-w-[100px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination footer matching real table */}
        <div className="w-full h-[60px] border-t flex items-center gap-x-6 p-2 bg-card justify-end">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-16 rounded-xl" />
        </div>
      </div>
    </>
  );
}
