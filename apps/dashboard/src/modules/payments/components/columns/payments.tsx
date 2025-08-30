"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@ui/components/ui/badge";
import { Button } from "@ui/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { MoreHorizontal, Check, X, FileImage } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { formatCurrency } from "../../utils";
import { approvePayment, rejectPayment } from "../../actions/payments";
import { useConfirmation } from "@/src/hooks/use-confirmation";
import Link from "next/link";

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

// Status badge colors
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100";
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100";
    case "CANCELLED":
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-100";
    case "REFUNDED":
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-100";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-100";
  }
};

// Payment method badge colors
const getMethodBadgeVariant = (method: string) => {
  switch (method) {
    case "BANK_TRANSFER":
      return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-100";
    case "CASH":
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-100";
    case "CHARGILY":
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100";
    case "CREDIT_CARD":
      return "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900 dark:text-cyan-100";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-100";
  }
};

// Payment type badge colors
const getTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "BUYPRODUCT":
      return "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900 dark:text-teal-100";
    case "BUYCOURSE":
      return "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900 dark:text-violet-100";
    case "SUBSCRIPTION":
      return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900 dark:text-rose-100";
    case "REFERAL_WITHDRAWAL":
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-100";
    case "REFUND":
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900 dark:text-slate-100";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-100";
  }
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

// Actions Cell Component
const ActionsCell = ({ payment }: { payment: Payment }) => {
  const isBankTransfer = payment.method === "BANK_TRANSFER";

  // Approve payment mutation with confirmation
  const approvePaymentMutation = useConfirmation(
    async (paymentId: string) => {
      return await approvePayment({ paymentId });
    },
    {
      confirmationConfig: {
        title: "الموافقة على الدفع",
        description: `هل أنت متأكد من الموافقة على الدفع بمبلغ ${formatCurrency(
          {
            amount: payment.amount,
            currency: payment.currency as "DZD",
          }
        )}؟ لن يمكن التراجع عن هذا الإجراء.`,
        confirmText: "الموافقة",
        cancelText: "إلغاء",
        variant: "default",
      },
      onSuccess: () => {
        console.log("Payment approved successfully");
        // You can add toast notification here
      },
      onError: (error) => {
        console.error("Failed to approve payment:", error);
        // You can add error toast notification here
      },
    }
  );

  // Reject payment mutation with confirmation
  const rejectPaymentMutation = useConfirmation(
    async (paymentId: string) => {
      return await rejectPayment({ paymentId });
    },
    {
      confirmationConfig: {
        title: "رفض الدفع",
        description: `هل أنت متأكد من رفض الدفع بمبلغ ${formatCurrency({
          amount: payment.amount,
          currency: payment.currency as "DZD",
        })}؟ سيتم إلغاء المعاملة نهائياً.`,
        confirmText: "رفض الدفع",
        cancelText: "إلغاء",
        variant: "destructive",
      },
      onSuccess: () => {
        console.log("Payment rejected successfully");
        // You can add toast notification here
      },
      onError: (error) => {
        console.error("Failed to reject payment:", error);
        // You can add error toast notification here
      },
    }
  );

  return (
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
        <DropdownMenuLabel className="text-right">الإجراءات</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(payment.id)}
          className="text-right"
        >
          نسخ معرف الدفع
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {/* Show payment proofs only for bank transfers */}
        {isBankTransfer && payment.Proofs && payment.Proofs.length > 0 && (
          <Link href={payment.Proofs[0].fileUrl} target="_blank">
            <DropdownMenuItem className="text-right">
              <FileImage className="ml-2 h-4 w-4" />
              عرض إثباتات الدفع ({payment.Proofs.length})
            </DropdownMenuItem>
          </Link>
        )}

        {/* Show approve/reject actions only for bank transfers */}
        {isBankTransfer && payment.status === "PENDING" && (
          <DropdownMenuItem
            className="text-green-600 dark:text-green-400 text-right"
            onClick={() =>
              approvePaymentMutation.mutateWithConfirmation(payment.id)
            }
            disabled={approvePaymentMutation.isLoading}
          >
            <Check className="ml-2 h-4 w-4" />
            {approvePaymentMutation.isLoading
              ? "جاري الموافقة..."
              : "الموافقة على الدفع"}
          </DropdownMenuItem>
        )}

        {isBankTransfer &&
          (payment.status === "PENDING" || payment.status === "PROCESSING") && (
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 text-right"
              onClick={() =>
                rejectPaymentMutation.mutateWithConfirmation(payment.id)
              }
              disabled={rejectPaymentMutation.isLoading}
            >
              <X className="ml-2 h-4 w-4" />
              {rejectPaymentMutation.isLoading ? "جاري الرفض..." : "رفض الدفع"}
            </DropdownMenuItem>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
      <Badge
        className={getStatusBadgeVariant(row.getValue("status") as string)}
      >
        {row.getValue("status") as string}
      </Badge>
    ),
  },
  {
    id: "paymentMethod",
    header: "طريقة الدفع",
    cell: ({ row }) => {
      const method =
        row.original.method || row.original.MethodConfig?.provider || "-";
      return <Badge className={getMethodBadgeVariant(method)}>{method}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإنشاء",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground w-fit">
        {formatDate(row.getValue("createdAt") as Date)}
      </div>
    ),
  },
  {
    id: "actions",
    header: "الإجراءات",
    cell: ({ row }) => <ActionsCell payment={row.original} />,
  },
];
