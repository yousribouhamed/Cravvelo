"use client";
import { DataTable } from "@/src/components/tables/data-tables/course-table";
import { Student } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { StudnetColumns } from "@/src/components/tables/columns/students";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/tables/table-loading";

interface CoursesTableShellProps {
  initialData: Student[];
}

const StudentTableShell: FC<CoursesTableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();

  const { data, refetch } = trpc.getAllStudents.useQuery(undefined, {
    initialData: initialData,
  });

  if (!isMounted) {
    return <DataTableLoading columnCount={6} />;
  }

  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col ">
      <DataTable columns={StudnetColumns} data={data} />
    </div>
  );
};

export default StudentTableShell;
