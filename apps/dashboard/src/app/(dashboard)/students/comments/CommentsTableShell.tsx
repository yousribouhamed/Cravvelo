"use client";

import { Comment } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { useCommentColumns } from "@/src/components/data-table/columns/comments";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-helpers/table-loading";
import { CommentsDataTable } from "@/src/components/data-table/tables/comments-table";

interface TableShellProps {
  initialData: Comment[];
}

const CommentsTableShell: FC<TableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();

  const { data, refetch } = trpc.getAllComments.useQuery(undefined, {
    initialData: initialData,
  });

  const columns = useCommentColumns(() => {
    refetch();
  });

  if (!isMounted) {
    return <DataTableLoading columnCount={5} />;
  }

  return (
    <div className="w-full min-h-[300px] my-4 h-fit flex flex-col">
      <CommentsDataTable columns={columns} data={data} refetch={refetch} />
    </div>
  );
};

export default CommentsTableShell;
