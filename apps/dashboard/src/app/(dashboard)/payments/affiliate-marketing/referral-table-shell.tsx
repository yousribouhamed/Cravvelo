"use client";

import { Referral } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-helpers/table-loading";
import { useReferralColumns } from "@/src/components/data-table/columns/referral";
import { DataTable } from "@/src/components/data-table/tables";

interface ReferralTableShellProps {
  initialData: Referral[];
}

const ReferralTableShell: FC<ReferralTableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();
  const columns = useReferralColumns();

  const { data, refetch } = trpc.getAllSubscribers.useQuery(undefined, {
    initialData: initialData,
  });

  const hasData =
    (initialData?.length ?? 0) > 0 || (data?.length ?? 0) > 0;
  if (!isMounted && !hasData) {
    return <DataTableLoading columnCount={6} />;
  }
  if (!isMounted && hasData) {
    return (
      <div className="w-full min-h-[300px] h-fit flex flex-col">
        <DataTable columns={columns} data={data ?? initialData ?? []} refetch={refetch} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col">
      <DataTable columns={columns} data={data} refetch={refetch} />
    </div>
  );
};

export default ReferralTableShell;
