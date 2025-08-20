import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons";
import { type Column } from "@tanstack/react-table";

import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center justify-start space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={
              column.getIsSorted() === "desc"
                ? `Sorted descending. Click to sort ascending.`
                : column.getIsSorted() === "asc"
                ? `Sorted ascending. Click to sort descending.`
                : `Not sorted. Click to sort ascending.`
            }
            variant="ghost"
            size="lg"
            className="h-8 dark:text-white data-[state=open]:bg-accent w-fit flex items-center justify-start gap-x-2 text-xs font-bold !whitespace-nowrap !px-2"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <div className="w-6 h-6 bg-red-600 dark:bg-red-500 flex items-center justify-center rounded-lg mr-2">
                <ArrowDownIcon
                  className="h-4 w-4 text-white"
                  aria-hidden="true"
                />
              </div>
            ) : column.getIsSorted() === "asc" ? (
              <div className="w-6 h-6 bg-green-600 dark:bg-green-500 flex items-center justify-center rounded-lg mr-2">
                <ArrowUpIcon
                  className="h-4 w-4 text-white"
                  aria-hidden="true"
                />
              </div>
            ) : (
              <CaretSortIcon
                className="ml-2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="bg-background border-border"
        >
          <DropdownMenuItem
            aria-label="Sort ascending"
            className="w-full items-center justify-between p-2 hover:bg-accent focus:bg-accent"
            onClick={() => column.toggleSorting(false)}
          >
            <div className="w-6 h-6 bg-green-600 dark:bg-green-500 flex items-center justify-center rounded-lg mr-2">
              <ArrowUpIcon
                className="h-3.5 w-3.5 text-white"
                aria-hidden="true"
              />
            </div>
            ترتيب تصاعدي
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem
            aria-label="Sort descending"
            className="w-full items-center justify-between p-2 hover:bg-accent focus:bg-accent"
            onClick={() => column.toggleSorting(true)}
          >
            <div className="w-6 h-6 bg-red-600 dark:bg-red-500 flex items-center justify-center rounded-lg mr-2">
              <ArrowDownIcon
                className="h-3.5 w-3.5 text-white"
                aria-hidden="true"
              />
            </div>
            ترتيب تنازلي
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
