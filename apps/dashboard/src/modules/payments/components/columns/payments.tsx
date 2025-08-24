"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@ui/components/ui/badge";
import { Button } from "@ui/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { MoreHorizontal, Eye, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { formatCurrency } from "../../utils";

export type Payment = {
  id: string;
  type:
    | "BUYPRODUCT"
    | "BUYCOURSE"
    | "SUBSCRIPTION"
    | "REFERAL_WITHDRAWAL"
    | "REFUND";
  amount: number;
  currency: string;
  status:
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED"
    | "REFUNDED";
  method?: "CASH" | "CHARGILY" | "BANK_TRANSFER" | "CREDIT_CARD";
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  Student?: {
    id: string;
    full_name: string;
    email: string;
    photo_url?: string;
  };

  Sale?: {
    Course?: { id: string; title: string; thumbnailUrl?: string };
    Product?: { id: string; title: string; thumbnailUrl?: string };
  };

  Subscription?: { id: string; plan: string; status: string };

  MethodConfig?: { id: string; provider: string };

  Proofs?: Array<{
    id: string;
    fileUrl: string;
    note?: string;
    verified: boolean;
    createdAt: Date;
  }>;

  Transactions?: Array<{
    id: string;
    type: string;
    amount: number;
    status: string;
    createdAt: Date;
  }>;
};

// Date formatter
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("ar-DZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

// item helper
const getItemInfo = (payment: Payment) => {
  if (payment.Sale?.Course) {
    return {
      type: "دورة",
      title: payment.Sale.Course.title,
      thumbnail: payment.Sale.Course.thumbnailUrl,
    };
  } else if (payment.Sale?.Product) {
    return {
      type: "منتج",
      title: payment.Sale.Product.title,
      thumbnail: payment.Sale.Product.thumbnailUrl,
    };
  } else if (payment.Subscription) {
    return {
      type: "اشتراك",
      title: payment.Subscription.plan,
      thumbnail: null,
    };
  }
  return null;
};

export const paymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "المعرف",
    cell: ({ row }) => (
      <div className="font-mono text-xs text-muted-foreground">
        {(row.getValue("id") as string).slice(-8)}
      </div>
    ),
  },
  {
    id: "student",
    header: "الطالب",
    cell: ({ row }) => {
      const s = row.original.Student;
      if (!s)
        return (
          <span className="text-muted-foreground text-sm">لا يوجد طالب</span>
        );
      return (
        <div className="flex items-center gap-2 min-w-[180px]">
          <Avatar className="h-8 w-8">
            <AvatarImage src={s.photo_url || undefined} />
            <AvatarFallback className="text-xs">
              {s.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{s.full_name}</span>
            <span className="text-xs text-muted-foreground">{s.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "item",
    header: "العنصر",
    cell: ({ row }) => {
      const info = getItemInfo(row.original);
      if (!info)
        return <span className="text-muted-foreground text-sm">-</span>;
      return (
        <div className="flex items-center gap-2 min-w-[180px]">
          {info.thumbnail && (
            <img
              src={info.thumbnail}
              alt={info.title}
              className="h-8 w-8 rounded object-cover"
            />
          )}
          <div className="flex flex-col">
            <span
              className="text-sm font-medium truncate max-w-[150px]"
              title={info.title}
            >
              {info.title}
            </span>
            <span className="text-xs text-muted-foreground">{info.type}</span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => {
      const p = row.original;
      return (
        <div className="font-semibold">
          {formatCurrency({
            amount: p.amount,
            currency: p.currency as unknown as "DZD",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("status") as string}</Badge>
    ),
  },
  {
    id: "paymentMethod",
    header: "طريقة الدفع",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.method || row.original.MethodConfig?.provider || "-"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإنشاء",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.getValue("createdAt") as Date)}
      </div>
    ),
  },
  {
    id: "actions",
    header: "الإجراءات",
    cell: ({ row }) => (
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">فتح القائمة</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-card text-card-foreground dtext-right"
        >
          <DropdownMenuLabel className="text-right">
            الإجراءات
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.id)}
            className="text-right"
          >
            نسخ معرف الدفع
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-right">
            <Eye className="ml-2 h-4 w-4" />
            عرض التفاصيل
          </DropdownMenuItem>
          {row.original.status === "PENDING" && (
            <DropdownMenuItem className="text-green-600 dark:text-green-400 text-right">
              <Check className="ml-2 h-4 w-4" />
              الموافقة على الدفع
            </DropdownMenuItem>
          )}
          {(row.original.status === "PENDING" ||
            row.original.status === "PROCESSING") && (
            <DropdownMenuItem className="text-red-600 dark:text-red-400 text-right">
              <X className="ml-2 h-4 w-4" />
              رفض الدفع
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
