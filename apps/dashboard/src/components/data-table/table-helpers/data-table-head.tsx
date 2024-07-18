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
            className=" h-8 data-[state=open]:bg-accent w-fit  flex items-center justify-start gap-x-2 text-xs font-bold !whitespace-nowrap !px-2 "
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            ) : (
              <CaretSortIcon className="ml-r h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            aria-label="Sort ascending"
            className="w-full items-center justify-between p-2"
            onClick={() => column.toggleSorting(false)}
          >
            <ArrowUpIcon
              className="ml-2 h-3.5 w-3.5 text-muted-foreground/70"
              aria-hidden="true"
            />
            ترتيب تصاعدي
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            aria-label="Sort descending"
            className="w-full items-center justify-between p-2"
            onClick={() => column.toggleSorting(true)}
          >
            <ArrowDownIcon
              className="ml-2 h-3.5 w-3.5 text-muted-foreground/70"
              aria-hidden="true"
            />
            ترتيب تفصيلي
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
