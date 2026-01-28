"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
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

const statusMap: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  PENDING: {
    label: "قيد الانتظار",
    variant: "secondary",
    icon: Clock,
  },
  PROCESSING: {
    label: "قيد المعالجة",
    variant: "secondary",
    icon: Clock,
  },
  COMPLETED: {
    label: "مكتمل",
    variant: "default",
    icon: CheckCircle,
  },
  FAILED: {
    label: "فشل",
    variant: "destructive",
    icon: XCircle,
  },
  CANCELLED: {
    label: "ملغي",
    variant: "destructive",
    icon: XCircle,
  },
  REFUNDED: {
    label: "مسترد",
    variant: "outline",
    icon: XCircle,
  },
};

export function PaymentColumns(): ColumnDef<Payment>[] {
  const t = useTranslations("profile.payments.methods");

  return [
    {
      accessorKey: "id",
      header: () => (
        <div className="flex items-center gap-2 font-semibold">
          <Hash className="h-4 w-4" />
          رقم الدفع
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
        <div className="flex items-center gap-2 font-semibold">العنصر</div>
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
          المبلغ
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
        <div className="flex items-center gap-2 font-semibold">الحالة</div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusConfig =
          statusMap[status] ||
          statusMap.PENDING || {
            label: status,
            variant: "outline" as const,
            icon: Clock,
          };
        const { label, variant, icon: Icon } = statusConfig;

        return (
          <Badge
            variant={variant}
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
          طريقة الدفع
        </div>
      ),
      cell: ({ row }) => {
        const method = row.getValue("method") as string | null;
        if (!method) {
          return <span className="text-gray-400 text-sm">—</span>;
        }
        return (
          <span className="text-sm">
            {t(method as any) || method}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <div className="flex items-center gap-2 font-semibold">
          <Calendar className="h-4 w-4" />
          التاريخ
        </div>
      ),
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;

        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {new Date(date).toLocaleDateString("ar-DZ", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </span>
          </div>
        );
      },
    },
  ];
}
