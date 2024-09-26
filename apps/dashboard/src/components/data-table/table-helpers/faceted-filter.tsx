"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  lang: string;
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
  lang,
}: DataTableFacetedFilter<TData>) {
  const fliterState = table.getState().columnFilters;
  // get all the selected itema
  const ACTIVE_FILTERS = fliterState
    .filter((item) => item.id === id)
    .map((item) => item.value);

  const onItemClicked = (isActive: boolean, value: string) => {
    if (isActive) {
      const filteredFilter = fliterState.filter((item) => item.value !== value);
      setColumnFilters(filteredFilter);
    }
    if (!isActive) {
      setColumnFilters([
        ...fliterState,
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
        <Button
          variant="secondary"
          className="bg-white rounded-xl border flex items-center gap-x-2"
        >
          {title}
          <ChevronDown className="w-4 h-4 text-[#303030]" strokeWidth={3} />
          {ACTIVE_FILTERS.length !== 0 && (
            <span className="w-5 h-5 text-white rounded-full bg-red-500 flex items-center justify-center">
              {" "}
              {ACTIVE_FILTERS.length}{" "}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={lang === "en" ? "start" : "end"}
        className="w-30"
      >
        {options.map((item) => {
          const isActive = ACTIVE_FILTERS.includes(item.value);
          return (
            <DropdownMenuItem
              key={item.value}
              onClick={() => onItemClicked(isActive, item.value)}
              dir={lang === "en" ? "ltr" : "rtl"}
              className="w-full h-[40px] flex items-center justify-start gap-x-2"
            >
              {lang === "en" ? (
                <>
                  <Checkbox id={item.value} checked={isActive} />{" "}
                  {<item.icon className="w-4 h-4 " />} {item.label}
                </>
              ) : (
                <>
                  <Checkbox id={item.value} checked={isActive} />{" "}
                  {<item.icon className="w-4 h-4 " />} {item.label}
                </>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
