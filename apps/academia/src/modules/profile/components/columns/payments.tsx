"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";
import {
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  BookOpen,
  Hash,
} from "lucide-react";

type Payment = {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  method: string | null;
  createdAt: Date;
  Sale: {
    Course: {
      id: string;
      title: string;
      thumbnailUrl: string | null;
    } | null;
    Product: {
      id: string;
      title: string;
      thumbnailUrl: string | null;
    } | null;
  } | null;
};

const statusVariantMap: Record<
  string,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  PENDING: { variant: "secondary", icon: Clock },
  PROCESSING: { variant: "secondary", icon: Clock },
  COMPLETED: { variant: "default", icon: CheckCircle },
  FAILED: { variant: "destructive", icon: XCircle },
  CANCELLED: { variant: "destructive", icon: XCircle },
  REFUNDED: { variant: "outline", icon: XCircle },
};

export function PaymentColumns(): ColumnDef<Payment>[] {
  const t = useTranslations("profile.payments");
  const tMethods = useTranslations("profile.payments.methods");
  const tStatus = useTranslations("profile.payments.statusValues");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? "ar-DZ" : "en-US";

  return [
    {
      accessorKey: "id",
      header: () => (
        <div className="flex items-center gap-2 font-semibold">
          <Hash className="h-4 w-4" />
          {t("paymentId")}
        </div>
      ),
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        return (
          <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
            {id.slice(0, 8)}...
          </span>
        );
      },
    },
    {
      accessorKey: "Sale",
      header: () => (
        <div className="flex items-center gap-2 font-semibold">{t("item")}</div>
      ),
      cell: ({ row }) => {
        const sale = row.original.Sale;
        if (!sale) {
          return <span className="text-gray-400 text-sm">—</span>;
        }

        const course = sale.Course;
        const product = sale.Product;

        if (course) {
          return (
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{course.title}</span>
            </div>
          );
        }

        if (product) {
          return (
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-green-500" />
              <span className="font-medium">{product.title}</span>
            </div>
          );
        }

        return <span className="text-gray-400 text-sm">—</span>;
      },
    },
    {
      accessorKey: "amount",
      header: () => (
        <div className="flex items-center gap-2 font-semibold">
          <DollarSign className="h-4 w-4" />
          {t("amount")}
        </div>
      ),
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        const currency = row.original.currency || "DZD";
        return (
          <span className="font-medium">
            {amount.toLocaleString()} {currency}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="flex items-center gap-2 font-semibold">{t("status")}</div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const config =
          statusVariantMap[status] ||
          statusVariantMap.PENDING || {
            variant: "outline" as const,
            icon: Clock,
          };
        const Icon = config.icon;
        const label =
          (status && (tStatus as (key: string) => string)(status)) || status;

        return (
          <Badge
            variant={config.variant}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium w-fit"
          >
            <Icon className="h-3 w-3" />
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "method",
      header: () => (
        <div className="flex items-center gap-2 font-semibold">
          <CreditCard className="h-4 w-4" />
          {t("method")}
        </div>
      ),
      cell: ({ row }) => {
        const method = row.getValue("method") as string | null;
        if (!method) {
          return <span className="text-gray-400 text-sm">—</span>;
        }
        return (
          <span className="text-sm">
            {tMethods(method as "CHARGILY" | "BANK_TRANSFER" | "CASH" | "CREDIT_CARD") || method}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <div className="flex items-center gap-2 font-semibold">
          <Calendar className="h-4 w-4" />
          {t("date")}
        </div>
      ),
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;

        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {new Date(date).toLocaleDateString(dateLocale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(date).toLocaleDateString(dateLocale, {
                weekday: "short",
              })}
            </span>
          </div>
        );
      },
    },
  ];
}
