"use client";

import { Admin } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { AdminColumns } from "@/src/components/tables/columns/admin";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/tables/table-loading";
import { AdminDataTable } from "@/src/components/tables/data-tables/admin-table";

interface AdminTableShellProps {
  initialData: Admin[];
}

const AdminTableShell: FC<AdminTableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();

  const { data, refetch } = trpc.getAllAdmins.useQuery(undefined, {
    initialData: initialData,
  });

  if (!isMounted) {
    return <DataTableLoading columnCount={6} />;
  }

  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col ">
      <AdminDataTable refetch={refetch} columns={AdminColumns} data={data} />
    </div>
  );
};

export default AdminTableShell;
