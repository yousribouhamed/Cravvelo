"use client";
import { DataTable } from "@/src/components/data-table/tables";
import { Student } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { useStudentsColumns } from "@/src/components/data-table/columns/students";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-helpers/table-loading";

interface StudentsTableShellProps {
  initialData: Student[];
}

const StudentsTableShell: FC<StudentsTableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();
  const columns = useStudentsColumns();

  const { data, refetch } = trpc.getAllStudents.useQuery(undefined, {
    initialData: initialData,
  });

  if (!isMounted) {
    return <DataTableLoading columnCount={6} />;
  }

  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col mt-8">
      <DataTable 
        columns={columns} 
        data={data || []} 
        showSearch={true}
        searchColumns={["full_name", "email", "phone"]}
      />
    </div>
  );
};

export default StudentsTableShell;
