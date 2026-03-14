"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Copy,
  Pencil,
  Archive,
  Power,
  PowerOff,
} from "lucide-react";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "../table-helpers/data-table-head";
import { getSelectColumn } from "../table-helpers/select-column";
import { Coupon } from "database";
import { Badge } from "@ui/components/ui/badge";
import { maketoast } from "../../toasts";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { trpc } from "@/src/app/_trpc/client";
import { useCurrency } from "@/src/hooks/use-currency";

interface UseCouponColumnsProps {
  onEdit?: (coupon: Coupon) => void;
}

export const useCouponColumns = ({
  onEdit,
}: UseCouponColumnsProps = {}): ColumnDef<Coupon>[] => {
  const t = useTranslations("coupons");
  const locale = useLocale();
  const { formatPrice } = useCurrency();

  const utils = trpc.useUtils();
  const archiveMutation = trpc.archiveCoupon.useMutation({
    onSuccess: () => {
      maketoast.success(t("messages.archived"));
      utils.getAllCoupons.invalidate();
    },
    onError: () => {
      maketoast.error(t("messages.updateError"));
    },
  });

  const toggleMutation = trpc.toggleCouponStatus.useMutation({
    onSuccess: (data) => {
      maketoast.success(
        data.isActive ? t("messages.activated") : t("messages.deactivated")
      );
      utils.getAllCoupons.invalidate();
    },
    onError: () => {
      maketoast.error(t("messages.updateError"));
    },
  });

  const formatDate = (date: Date) => {
    // Check if it's a "forever" date (year 2999+)
    if (date.getFullYear() >= 2999) {
      return t("form.forever");
    }
    return format(date, "dd MMM yyyy", {
      locale: locale === "ar" ? ar : enUS,
    });
  };

  return [
    getSelectColumn<Coupon>(),
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.code")} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-x-2">
            <p className="font-bold text-sm font-mono">{row.original.code}</p>
            <Button
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(row.original.code);
                maketoast.success(t("messages.copied"));
              }}
              variant="ghost"
              className="w-8 h-8 hover:bg-muted transition-all duration-300"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      filterFn: "includesString",
    },
    {
      accessorKey: "discountType",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.discountType")}
        />
      ),
      cell: ({ row }) => {
        return (
          <Badge variant="outline" className="font-medium">
            {t(`discountTypes.${row.original.discountType}`)}
          </Badge>
        );
      },
      filterFn: "includesString",
    },
    {
      accessorKey: "discountAmount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.discountAmount")}
        />
      ),
      cell: ({ row }) => {
        return (
          <p className="text-sm font-bold">
            {row.original.discountType === "FIXED_AMOUNT"
              ? formatPrice(row.original.discountAmount)
              : `${row.original.discountAmount}%`}
          </p>
        );
      },
    },
    {
      accessorKey: "expirationDate",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.expirationDate")}
        />
      ),
      cell: ({ row }) => {
        const isExpired =
          new Date(row.original.expirationDate) < new Date() &&
          new Date(row.original.expirationDate).getFullYear() < 2999;
        return (
          <p
            className={`text-sm font-medium ${isExpired ? "text-red-500" : ""}`}
          >
            {formatDate(new Date(row.original.expirationDate))}
          </p>
        );
      },
    },
    {
      accessorKey: "usageLimit",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.usageLimit")}
        />
      ),
      cell: ({ row }) => {
        return (
          <p className="text-sm font-medium">
            {row.original.usageLimit ?? "∞"}
          </p>
        );
      },
    },
    {
      accessorKey: "usageCount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.usageCount")}
        />
      ),
      cell: ({ row }) => {
        const usageCount = row.original.usageCount ?? 0;
        const usageLimit = row.original.usageLimit;
        const isNearLimit = usageLimit && usageCount >= usageLimit * 0.8;

        return (
          <p
            className={`text-sm font-medium ${isNearLimit ? "text-orange-500" : ""}`}
          >
            {usageCount}
            {usageLimit && ` / ${usageLimit}`}
          </p>
        );
      },
    },
    {
      accessorKey: "isActive",
      id: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.status")} />
      ),
      cell: ({ row }) => {
        const isActive = row.original?.isActive;
        const isArchived = row.original?.isArchive;

        if (isArchived) {
          return (
            <Badge className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow-md">
              {t("status.archived")}
            </Badge>
          );
        }

        return isActive ? (
          <Badge className="bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md">
            {t("status.active")}
          </Badge>
        ) : (
          <Badge className="bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md">
            {t("status.inactive")}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        const isActive = row.original.isActive;
        const isArchived = row.original.isArchive;

        if (value.includes("archived") && isArchived) return true;
        if (value.includes("active") && isActive && !isArchived) return true;
        if (value.includes("inactive") && !isActive && !isArchived) return true;

        return false;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const coupon = row.original;

        return (
          <div className="w-full h-10 flex items-center justify-end gap-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-10 p-0 bg-card rounded-xl border"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(coupon.code);
                    maketoast.success(t("messages.copied"));
                  }}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {t("actions.copyCode")}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {onEdit && !coupon.isArchive && (
                  <DropdownMenuItem
                    onClick={() => onEdit(coupon)}
                    className="flex items-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    {t("actions.edit")}
                  </DropdownMenuItem>
                )}

                {!coupon.isArchive && (
                  <DropdownMenuItem
                    onClick={() => toggleMutation.mutate({ id: coupon.id })}
                    className="flex items-center gap-2"
                    disabled={toggleMutation.isLoading}
                  >
                    {coupon.isActive ? (
                      <>
                        <PowerOff className="h-4 w-4" />
                        {t("actions.deactivate")}
                      </>
                    ) : (
                      <>
                        <Power className="h-4 w-4" />
                        {t("actions.activate")}
                      </>
                    )}
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {!coupon.isArchive && (
                  <DropdownMenuItem
                    onClick={() =>
                      archiveMutation.mutate({ coupon_id: coupon.id })
                    }
                    className="flex items-center gap-2 text-destructive"
                    disabled={archiveMutation.isLoading}
                  >
                    <Archive className="h-4 w-4" />
                    {t("actions.archive")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};

// Note: Use useCouponColumns hook instead of CouponColumns for new code
// CouponColumns is deprecated - kept only for backward compatibility with static usage
