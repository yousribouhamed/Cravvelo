"use client";

import { Comment } from "database";
import type { FC } from "react";
import { useState, useCallback, useMemo } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { useCommentColumns } from "@/src/components/data-table/columns/comments";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-helpers/table-loading";
import { CommentsDataTable } from "@/src/components/data-table/tables/comments-table";
import { useTranslations } from "next-intl";
import { maketoast } from "@/src/components/toasts";

const PAGE_SIZE = 10;

interface TableShellProps {
  initialData: {
    comments: Comment[];
    totalCount: number;
    pageCount: number;
    currentPage: number;
  };
}

const CommentsTableShell: FC<TableShellProps> = ({ initialData }) => {
  const t = useTranslations("comments.bulkActions");
  const isMounted = useMounted();
  const [page, setPage] = useState(1);
  const utils = trpc.useUtils();
  const approveMutation = trpc.approveComment.useMutation({
    onSuccess: () => {
      maketoast.success();
      void utils.getAllComments.invalidate();
    },
    onError: () => maketoast.error(),
  });
  const rejectMutation = trpc.rejectComment.useMutation({
    onSuccess: () => {
      maketoast.success();
      void utils.getAllComments.invalidate();
    },
    onError: () => maketoast.error(),
  });

  const { data, refetch, isLoading } = trpc.getAllComments.useQuery(
    { page, limit: PAGE_SIZE },
    {
      initialData,
      refetchOnWindowFocus: false,
    }
  );

  const columns = useCommentColumns(() => {
    refetch();
  });

  const comments = data?.comments ?? [];
  const totalCount = data?.totalCount ?? 0;
  const pageCount = data?.pageCount ?? 1;
  const currentPage = data?.currentPage ?? 1;
  const hasData =
    (initialData?.comments?.length ?? 0) > 0 || comments.length > 0;
  const showLoader = isLoading && !hasData;

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleApproveSelected = useCallback(
    (selected: Comment[]) => {
      selected.forEach((c) => approveMutation.mutate({ comment_id: c.id }));
    },
    [approveMutation]
  );
  const handleRejectSelected = useCallback(
    (selected: Comment[]) => {
      selected.forEach((c) => rejectMutation.mutate({ comment_id: c.id }));
    },
    [rejectMutation]
  );

  const bulkActions = useMemo(
    () => [
      { label: t("approveSelected"), onClick: handleApproveSelected },
      { label: t("rejectSelected"), onClick: handleRejectSelected, variant: "destructive" as const },
    ],
    [t, handleApproveSelected, handleRejectSelected]
  );

  if (!isMounted && !hasData) {
    return <DataTableLoading columnCount={5} />;
  }
  if (!isMounted && hasData) {
    return (
      <div className="w-full min-h-[300px] my-4 h-fit flex flex-col">
        <CommentsDataTable
          columns={columns}
          data={comments}
          refetch={refetch}
          pageCount={pageCount}
          totalCount={totalCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          pageSize={PAGE_SIZE}
          bulkActions={bulkActions}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[300px] my-4 h-fit flex flex-col">
      <CommentsDataTable
        columns={columns}
        data={comments}
        refetch={refetch}
        pageCount={pageCount}
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={PAGE_SIZE}
        isLoading={showLoader}
        bulkActions={bulkActions}
      />
    </div>
  );
};

export default CommentsTableShell;
