"use client";
import { DataTable } from "@/src/components/tables/data-tables/course-table";
import { Website } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { WebsiteColumns } from "@/src/components/tables/columns/websites";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/tables/table-loading";

interface CoursesTableShellProps {
  initialData: Website[];
}

const WebsiteTableShell: FC<CoursesTableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();

  const { data, refetch } = trpc.getAllWebsites.useQuery(undefined, {
    initialData: initialData,
  });

  if (!isMounted) {
    return <DataTableLoading columnCount={6} />;
  }

  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col ">
      <DataTable columns={WebsiteColumns} data={data} />
    </div>
  );
};

export default WebsiteTableShell;
