"use client";

import { Button } from "@ui/components/ui/button";
import type { FC } from "react";
import { ColumnFiltersState, Table } from "@tanstack/react-table";
import { FacetedFilter } from "../table-helpers/faceted-filter";
import { UserCheck, XCircle, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface StudentsTableHeaderProps {
  table: Table<any>;
  data: any[];
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

const statusOptions = [
  {
    value: "true",
    label: "Active",
    icon: UserCheck,
  },
  {
    value: "false",
    label: "Inactive",
    icon: XCircle,
  },
];

const emailVerifiedOptions = [
  {
    value: "true",
    label: "Verified",
    icon: CheckCircle2,
  },
  {
    value: "false",
    label: "Not Verified",
    icon: XCircle,
  },
];

const StudentTableHeader: FC<StudentsTableHeaderProps> = ({ table, data, setColumnFilters }) => {
  const t = useTranslations("students");

  return (
    <div className="flex items-center justify-start gap-x-4">
      <FacetedFilter
        table={table}
        title={t("filters.status")}
        id="isActive"
        setColumnFilters={setColumnFilters}
        options={statusOptions.map(opt => ({
          ...opt,
          label: t(`filters.${opt.label.toLowerCase()}`),
        }))}
      />
      <FacetedFilter
        table={table}
        title={t("filters.emailVerified")}
        id="emailVerified"
        setColumnFilters={setColumnFilters}
        options={emailVerifiedOptions.map(opt => ({
          ...opt,
          label: t(`filters.${opt.value === "true" ? "verified" : "notVerified"}`),
        }))}
      />
    </div>
  );
};

export default StudentTableHeader;
