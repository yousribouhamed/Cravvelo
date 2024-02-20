"use client";
import { DataTable } from "@/src/components/data-table";
import { Notification } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { NotificationColumns } from "@/src/components/data-table/columns/notifications";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-loading";
import DeleteCourseModel from "@/src/components/models/delete-course-modal";

interface TableShellProps {
  initialData: Notification[];
}

const NotificationsTableShell: FC<TableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();

  const { data, refetch } = trpc.getAllNotifications.useQuery(undefined, {
    initialData: initialData,
  });

  if (!isMounted) {
    return <DataTableLoading columnCount={6} />;
  }

  console.log(data);
  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col ">
      <DeleteCourseModel refetch={refetch} />
      <DataTable columns={NotificationColumns} data={data} />
    </div>
  );
};

export default NotificationsTableShell;
