"use client";
import { DataTable } from "@/src/components/data-table/tables";
import { Sale } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { OrderColumns } from "@/src/components/data-table/columns/orders";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-helpers/table-loading";

interface OrdersTableShellProps {
  initialData: Sale[];
}

const OrdersTableShell: FC<OrdersTableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();

  const { data, refetch } = trpc.getAllOrders.useQuery(undefined, {
    initialData: initialData,
  });

  if (!isMounted) {
    return <DataTableLoading hideSearch columnCount={6} />;
  }

  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col ">
      <DataTable columns={OrderColumns} data={data} />
    </div>
  );
};

export default OrdersTableShell;
