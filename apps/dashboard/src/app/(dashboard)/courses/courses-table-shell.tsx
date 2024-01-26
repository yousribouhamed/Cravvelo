"use client";
import { DataTable } from "@/src/components/data-table";
import { Course } from "database";
import type { FC } from "react";
import { trpc } from "../../_trpc/client";
import { columns } from "@/src/components/data-table/columns/courses";

interface CoursesTableShellProps {
  initialData: Course[];
}

const CoursesTableShell: FC<CoursesTableShellProps> = ({ initialData }) => {
  const { data } = trpc.getAllCourses.useQuery(undefined, {
    initialData: initialData,
  });
  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col ">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default CoursesTableShell;
