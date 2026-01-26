"use client";

import type { FC } from "react";
import { ColumnFiltersState, Table } from "@tanstack/react-table";
import { FacetedFilter } from "../table-helpers/faceted-filter";
import { PencilRuler, Check, Archive, CandyCane, Ghost, Flame } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface CoursesTableHeaderProps {
  table: Table<any>;
  data: any[];
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  onStatusFilterChange?: (values: string[]) => void;
  onLevelFilterChange?: (values: string[]) => void;
  serverSideFiltering?: boolean;
}

const statusOptions = [
  {
    value: "DRAFT",
    label: "Draft",
    icon: PencilRuler,
  },
  {
    value: "PUBLISED",
    label: "Published",
    icon: Check,
  },
  {
    value: "ARCHIVED",
    label: "Archived",
    icon: Archive,
  },
  {
    value: "PRIVATE",
    label: "Private",
    icon: Archive,
  },
];

const levelOptions = [
  {
    value: "BEGINNER",
    label: "Beginner",
    icon: CandyCane,
  },
  {
    value: "INTERMEDIATE",
    label: "Intermediate",
    icon: Ghost,
  },
  {
    value: "ADVANCED",
    label: "Advanced",
    icon: Flame,
  },
];

const CoursesTableHeader: FC<CoursesTableHeaderProps> = ({ 
  table, 
  data, 
  setColumnFilters,
  onStatusFilterChange,
  onLevelFilterChange,
  serverSideFiltering = false,
}) => {
  const t = useTranslations("courses");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);

  // Sync with table filters if not server-side
  useEffect(() => {
    if (!serverSideFiltering) {
      const statusFilters = table.getState().columnFilters
        .filter((f) => f.id === "status")
        .map((f) => f.value as string);
      const levelFilters = table.getState().columnFilters
        .filter((f) => f.id === "level")
        .map((f) => f.value as string);
      setSelectedStatus(statusFilters);
      setSelectedLevel(levelFilters);
    }
  }, [table.getState().columnFilters, serverSideFiltering]);

  const handleStatusChange = (values: string[]) => {
    setSelectedStatus(values);
    if (serverSideFiltering && onStatusFilterChange) {
      onStatusFilterChange(values);
    }
  };

  const handleLevelChange = (values: string[]) => {
    setSelectedLevel(values);
    if (serverSideFiltering && onLevelFilterChange) {
      onLevelFilterChange(values);
    }
  };

  return (
    <div className="flex items-center justify-start gap-x-4">
      <FacetedFilter
        table={table}
        title={t("filters.status")}
        id="status"
        setColumnFilters={serverSideFiltering ? () => {} : setColumnFilters}
        options={statusOptions.map(opt => {
          const statusKey = opt.value === "DRAFT" 
            ? "draft" 
            : opt.value === "PUBLISED"
            ? "published"
            : opt.value === "ARCHIVED"
            ? "archived"
            : "private";
          return {
            ...opt,
            label: t(`filters.${statusKey}`),
          };
        })}
        serverSideFiltering={serverSideFiltering}
        selectedValues={selectedStatus}
        onValuesChange={handleStatusChange}
      />
      <FacetedFilter
        table={table}
        title={t("filters.level")}
        id="level"
        setColumnFilters={serverSideFiltering ? () => {} : setColumnFilters}
        options={levelOptions.map(opt => {
          const levelKey = opt.value === "BEGINNER"
            ? "beginner"
            : opt.value === "INTERMEDIATE"
            ? "intermediate"
            : "advanced";
          return {
            ...opt,
            label: t(`filters.${levelKey}`),
          };
        })}
        serverSideFiltering={serverSideFiltering}
        selectedValues={selectedLevel}
        onValuesChange={handleLevelChange}
      />
    </div>
  );
};

export default CoursesTableHeader;
