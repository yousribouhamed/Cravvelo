"use client";
import { DataTable } from "@/src/components/data-table";
import { Coupon } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { CouponColumns } from "@/src/components/data-table/columns/cobons";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-loading";

interface CouponTableShellProps {
  initialData: Coupon[];
}

const CouponsTableShell: FC<CouponTableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();

  const { data, refetch } = trpc.getAllCoupons.useQuery(undefined, {
    initialData: initialData,
  });

  if (!isMounted) {
    return <DataTableLoading columnCount={6} />;
  }

  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col ">
      <DataTable columns={CouponColumns} data={data} refetch={refetch} />
    </div>
  );
};

export default CouponsTableShell;
