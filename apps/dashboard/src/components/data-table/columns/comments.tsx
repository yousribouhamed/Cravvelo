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
    const statusConfig: Record<
      string,
      { variant: "default" | "secondary" | "destructive" | "outline"; className: string }
    > = {
      approved: { variant: "default", className: "bg-green-500 text-white" },
      pending: { variant: "secondary", className: "bg-yellow-500 text-white" },
      rejected: { variant: "destructive", className: "bg-red-500 text-white" },
      verification_pending: { variant: "outline", className: "bg-gray-500 text-white" },
    };

    const config = statusConfig[status] || statusConfig.verification_pending;
    const statusKey = status as keyof typeof statusConfig;
    const translatedStatus = t(`status.${statusKey}`) || status;

    return (
      <Badge variant={config.variant} className={config.className}>
        {translatedStatus}
      </Badge>
    );
  };

  return [
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
        return value.includes(row.getValue(id));
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
                  disabled={comment.status === "approved"}
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
