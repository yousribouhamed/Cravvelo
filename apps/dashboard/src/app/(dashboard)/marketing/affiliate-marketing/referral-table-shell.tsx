"use client";

import { Referral } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-loading";
import { ReferralColumns } from "@/src/components/data-table/columns/referral";
import { DataTable } from "@/src/components/data-table";

interface CouponTableShellProps {
  initialData: Referral[];
}

const ReferralTableShell: FC<CouponTableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();

  const { data, refetch } = trpc.getAllSubscribers.useQuery(undefined, {
    initialData: initialData,
  });

  if (!isMounted) {
    return <DataTableLoading columnCount={6} />;
  }

  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col ">
      <DataTable columns={ReferralColumns} data={data} refetch={refetch} />
    </div>
  );
};

export default ReferralTableShell;
