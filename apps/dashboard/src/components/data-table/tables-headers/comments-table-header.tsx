"use client";

import { Input } from "@ui/components/ui/input";
import type { FC } from "react";
import { ColumnFiltersState, Table } from "@tanstack/react-table";
import { FacetedFilter } from "../table-helpers/faceted-filter";
import { Search, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface TableHeaderProps {
  table: Table<any>;
  refetch?: () => Promise<any>;
  data: any[];
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  onSearchChange?: (value: string) => void;
  onStatusFilterChange?: (values: string[]) => void;
  serverSideFiltering?: boolean;
}

const statusOptions = [
  {
    value: "approved",
    label: "Approved",
    icon: CheckCircle,
  },
  {
    value: "pending",
    label: "Pending",
    icon: Clock,
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: XCircle,
  },
  {
    value: "verification_pending",
    label: "Pending Verification",
    icon: AlertCircle,
  },
];

const CommentsTableHeader: FC<TableHeaderProps> = ({
  table,
  refetch,
  data,
  setColumnFilters,
  onSearchChange,
  onStatusFilterChange,
  serverSideFiltering = false,
}) => {
  const t = useTranslations("comments");
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  // Sync with table filters if not server-side
  useEffect(() => {
    if (!serverSideFiltering) {
      const statusFilters = table
        .getState()
        .columnFilters.filter((f) => f.id === "status")
        .map((f) => f.value as string);
      setSelectedStatus(statusFilters);
    }
  }, [table.getState().columnFilters, serverSideFiltering]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (serverSideFiltering && onSearchChange) {
      onSearchChange(value);
    } else {
      // Client-side search on content
      table.getColumn("content")?.setFilterValue(value);
    }
  };

  const handleStatusChange = (values: string[]) => {
    setSelectedStatus(values);
    if (serverSideFiltering && onStatusFilterChange) {
      onStatusFilterChange(values);
    }
  };

  return (
    <div className="w-full py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search.placeholder")}
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-9 w-[200px] md:w-[250px] h-[50px] rounded-xl"
          />
        </div>

        {/* Status Filter */}
        <FacetedFilter
          table={table}
          title={t("filters.status")}
          id="status"
          setColumnFilters={serverSideFiltering ? () => {} : setColumnFilters}
          options={statusOptions.map((opt) => ({
            ...opt,
            label: t(`status.${opt.value}`),
          }))}
          serverSideFiltering={serverSideFiltering}
          selectedValues={selectedStatus}
          onValuesChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default CommentsTableHeader;
