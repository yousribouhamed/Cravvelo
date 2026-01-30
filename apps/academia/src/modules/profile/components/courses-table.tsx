"use client";

import { DataTable } from "@/modules/profile/components/data-table";
import { CourseSale, useCourseColumns } from "@/modules/profile/components/columns/courses";

export default function CoursesTable({ data }: { data: CourseSale[] }) {
  const columns = useCourseColumns();
  return <DataTable columns={columns} data={data} />;
}

