"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Copy, Check, X } from "lucide-react";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Comment } from "database";
import { maketoast } from "../../toasts";
import { DataTableColumnHeader } from "../table-helpers/data-table-head";
import { getSelectColumn } from "../table-helpers/select-column";
import StarRatings from "react-star-ratings";
import { Badge } from "@ui/components/ui/badge";
import { trpc } from "@/src/app/_trpc/client";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export const useCommentColumns = (
  refetch?: () => void
): ColumnDef<Comment>[] => {
  const t = useTranslations("comments");
  const locale = useLocale();

  const formatDate = (date: Date) => {
    return format(date, "dd MMMM yyyy", {
      locale: locale === "ar" ? ar : enUS,
    });
  };

  const getStatusBadge = (status: string) => {
    const normalized = (status ?? "").toLowerCase();
    const statusConfig: Record<
      string,
      { className: string }
    > = {
      approved: {
        className:
          "border border-green-500/30 bg-green-500/20 text-green-700 dark:text-green-300 dark:bg-green-500/25",
      },
      pending: {
        className:
          "border border-amber-500/30 bg-amber-500/20 text-amber-700 dark:text-amber-300 dark:bg-amber-500/25",
      },
      rejected: {
        className:
          "border border-red-500/30 bg-red-500/20 text-red-700 dark:text-red-300 dark:bg-red-500/25",
      },
      verification_pending: {
        className:
          "border border-gray-500/30 bg-gray-500/20 text-gray-700 dark:text-gray-300 dark:bg-gray-500/25",
      },
    };

    const config =
      statusConfig[normalized] || statusConfig.verification_pending;
    const statusKeys = [
      "approved",
      "pending",
      "rejected",
      "verification_pending",
    ];
    const translatedStatus = statusKeys.includes(normalized)
      ? t(
          (`status.${normalized}`) as
            | "status.approved"
            | "status.pending"
            | "status.rejected"
            | "status.verification_pending"
        )
      : status;

    return (
      <Badge variant="secondary" className={config.className}>
        {translatedStatus}
      </Badge>
    );
  };

  return [
    getSelectColumn<Comment>(),
    {
      accessorKey: "content",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.content")} />
      ),
      cell: ({ row }) => {
        const content = row.original.content;
        const truncated =
          content.length > 50 ? content.substring(0, 50) + "..." : content;
        return (
          <p className="max-w-[200px] truncate" title={content}>
            {truncated}
          </p>
        );
      },
    },

    {
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.rating")} />
      ),
      cell: ({ row }) => {
        return (
          <StarRatings
            starRatedColor="#FFB800"
            rating={row.original.rating}
            starDimension="18px"
            starSpacing="1px"
          />
        );
      },
    },

    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.status")} />
      ),
      cell: ({ row }) => {
        return getStatusBadge(row.original.status);
      },
      filterFn: (row, id, value) => {
        const rowStatus = String(row.getValue(id) ?? "").toLowerCase();
        const values = (value as string[]).map((v) =>
          String(v).toLowerCase()
        );
        if (values.length === 0) return true;
        return values.includes(rowStatus);
      },
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.createdAt")} />
      ),
      cell: ({ row }) => {
        return (
          <p className="text-sm font-medium">
            {formatDate(row.original.createdAt)}
          </p>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const comment = row.original;

        /* eslint-disable react-hooks/rules-of-hooks */
        const approveCommentMutation = trpc.approveComment.useMutation({
          onError: () => {
            maketoast.error(t("messages.approveError"));
          },
          onSuccess: () => {
            maketoast.success(t("messages.approved"));
            refetch?.();
          },
        });

        const rejectCommentMutation = trpc.rejectComment.useMutation({
          onError: () => {
            maketoast.error(t("messages.rejectError"));
          },
          onSuccess: () => {
            maketoast.success(t("messages.rejected"));
            refetch?.();
          },
        });
        /* eslint-enable react-hooks-rules-of-hooks */

        return (
          <div className="w-full h-10 flex items-center justify-end gap-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-10 p-0 bg-white rounded-xl border"
                >
                  <span className="sr-only">{t("actions.openMenu")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => {
                    approveCommentMutation.mutate({
                      comment_id: comment.id,
                    });
                  }}
                  className="w-full h-full flex justify-between items-center px-2"
                  // Disable only when it's actually approved for public display.
                  // This also lets us fix older rows where `status` was set to "approved"
                  // but `isApproved` stayed false (so comments never appeared publicly).
                  disabled={comment.isApproved === true}
                >
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  {t("actions.approve")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    rejectCommentMutation.mutate({
                      comment_id: comment.id,
                    });
                  }}
                  className="w-full h-full flex justify-between items-center px-2"
                  disabled={comment.status === "rejected"}
                >
                  <X className="w-4 h-4 mr-2 text-red-500" />
                  {t("actions.reject")}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(comment.content);
                    maketoast.info(t("messages.copied"));
                  }}
                  className="w-full h-full flex justify-between items-center px-2"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {t("actions.copyContent")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};

// Keep the old export for backward compatibility during migration
export const CommentColumns = [] as ColumnDef<Comment>[];
