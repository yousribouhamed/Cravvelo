"use client";
import { DataTable } from "@/src/components/data-table/tables";
import { Payments } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { BillingColumns } from "@/src/components/data-table/columns/billing";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-helpers/table-loading";
import DeleteCourseModel from "@/src/components/models/delete-course-modal";

interface OrdersTableShellProps {
  initialData: Payments[];
}

const BillingTableShell: FC<OrdersTableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();

  const { data, refetch } = trpc.getAllPayments.useQuery(undefined, {
    initialData: initialData,
  });

  if (!isMounted) {
    return <DataTableLoading columnCount={6} />;
  }

  console.log(data);
  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col ">
      <DataTable columns={BillingColumns} data={data} />
    </div>
  );
};

export default BillingTableShell;
