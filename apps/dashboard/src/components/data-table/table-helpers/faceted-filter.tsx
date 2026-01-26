"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { ChevronDown, LucideIcon } from "lucide-react";
import { ColumnFiltersState, Table } from "@tanstack/react-table";

import { Checkbox } from "@ui/components/ui/checkbox";
type Checked = DropdownMenuCheckboxItemProps["checked"];

interface DataTableFacetedFilter<TData> {
  table: Table<TData>;
  title?: string;
  id: string;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  options: {
    label: string;
    value: string;
    icon?: LucideIcon;
  }[];
}

export function FacetedFilter<TData>({
  title,
  options,
  table,
  setColumnFilters,
  id,
}: DataTableFacetedFilter<TData>) {
  const fliterState = table.getState().columnFilters;
  // get all the selected itema
  const ACTIVE_FILTERS = fliterState
    .filter((item) => item.id === id)
    .map((item) => item.value);

  const onItemClicked = (isActive: boolean, value: string) => {
    const currentFilters = fliterState.filter((item) => item.id === id);
    const otherFilters = fliterState.filter((item) => item.id !== id);

    if (isActive) {
      // Remove this value from filters
      const updatedFilters = currentFilters.filter((item) => item.value !== value);
      setColumnFilters([...otherFilters, ...updatedFilters]);
    } else {
      // Add this value to filters
      setColumnFilters([
        ...otherFilters,
        ...currentFilters,
        {
          id,
          value,
        },
      ]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="bg-card text-card-foreground rounded-xl border flex items-center gap-x-2 h-[50px] px-4 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {title}
          <ChevronDown className="w-4 h-4 text-muted-foreground" strokeWidth={3} />
          {ACTIVE_FILTERS.length !== 0 && (
            <span className="w-5 h-5 text-white rounded-full bg-red-500 flex items-center justify-center text-xs">
              {ACTIVE_FILTERS.length}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-30">
        {options.map((item) => {
          const isActive = ACTIVE_FILTERS.includes(item.value);
          return (
            <DropdownMenuItem
              key={item.value}
              onClick={() => onItemClicked(isActive, item.value)}
              dir="rtl"
              className="w-full h-[40px] flex items-center justify-start gap-x-2"
            >
              <Checkbox id={item.value} checked={isActive} />{" "}
              {<item.icon className="w-4 h-4 " />} {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
