"use client";
import { DataTable } from "@/src/components/data-table";
import { Comment } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { CommentColumns } from "@/src/components/data-table/columns/comments";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-loading";
import DeleteCourseModel from "@/src/components/models/delete-course-model";

interface TableShellProps {
  initialData: Comment[];
}

const CommentsTableShell: FC<TableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();

  const { data, refetch } = trpc.getAllComments.useQuery(undefined, {
    initialData: initialData,
  });

  if (!isMounted) {
    return <DataTableLoading columnCount={6} />;
  }

  console.log(data);
  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col ">
      <DeleteCourseModel refetch={refetch} />
      <DataTable columns={CommentColumns} data={data} />
    </div>
  );
};

export default CommentsTableShell;
