"use client";
import { DataTable } from "@/src/components/data-table";
import { Student } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { StudentsColumns } from "@/src/components/data-table/columns/students";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-loading";
import DeleteCourseModel from "@/src/components/models/delete-course-model";

interface StudentsTableShellProps {
  initialData: Student[];
}

const StudentsTableShell: FC<StudentsTableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();

  const { data, refetch } = trpc.getAllStudents.useQuery(undefined, {
    initialData: initialData,
  });

  if (!isMounted) {
    return <DataTableLoading columnCount={6} />;
  }

  console.log(data);
  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col mt-8">
      <DataTable columns={StudentsColumns} data={data} />
    </div>
  );
};

export default StudentsTableShell;
