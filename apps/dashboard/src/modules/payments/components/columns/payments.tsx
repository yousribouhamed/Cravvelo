"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@ui/components/ui/badge";
import { Button } from "@ui/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { MoreHorizontal, Eye, Check, X, DollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";

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

  // Relations from getAllPayments
  Student?: {
    id: string;
    full_name: string;
    email: string;
    photo_url?: string;
  };

  Sale?: {
    Course?: {
      id: string;
      title: string;
      thumbnailUrl?: string;
    };
    Product?: {
      id: string;
      title: string;
      thumbnailUrl?: string;
    };
  };

  Subscription?: {
    id: string;
    plan: string;
    status: string;
  };

  MethodConfig?: {
    id: string;
    provider: string;
  };

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

// Status badge component
const StatusBadge = ({ status }: { status: Payment["status"] }) => {
  const statusConfig = {
    PENDING: {
      label: "قيد الانتظار",
      variant: "outline" as const,
      className: "border-yellow-500 text-yellow-700 bg-yellow-50",
    },
    PROCESSING: {
      label: "قيد المعالجة",
      variant: "outline" as const,
      className: "border-blue-500 text-blue-700 bg-blue-50",
    },
    COMPLETED: {
      label: "مكتملة",
      variant: "outline" as const,
      className: "border-green-500 text-green-700 bg-green-50",
    },
    FAILED: {
      label: "فشلت",
      variant: "outline" as const,
      className: "border-red-500 text-red-700 bg-red-50",
    },
    CANCELLED: {
      label: "ملغية",
      variant: "outline" as const,
      className: "border-gray-500 text-gray-700 bg-gray-50",
    },
    REFUNDED: {
      label: "مسترد",
      variant: "outline" as const,
      className: "border-orange-500 text-orange-700 bg-orange-50",
    },
  };

  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

// Payment type badge component
const PaymentTypeBadge = ({ type }: { type: Payment["type"] }) => {
  const typeConfig = {
    BUYPRODUCT: { label: "منتج", variant: "secondary" as const },
    BUYCOURSE: { label: "دورة", variant: "default" as const },
    SUBSCRIPTION: { label: "اشتراك", variant: "outline" as const },
    REFERAL_WITHDRAWAL: { label: "إحالة", variant: "secondary" as const },
    REFUND: { label: "استرداد", variant: "destructive" as const },
  };

  const config = typeConfig[type];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// Payment method badge component
const PaymentMethodBadge = ({
  method,
  provider,
}: {
  method?: Payment["method"];
  provider?: string;
}) => {
  if (!method && !provider)
    return <span className="text-muted-foreground text-sm">-</span>;

  const methodTranslations: Record<string, string> = {
    CASH: "نقداً",
    CHARGILY: "شارجيلي",
    BANK_TRANSFER: "تحويل بنكي",
    CREDIT_CARD: "بطاقة ائتمان",
    STRIPE: "سترايب",
    P2P: "نظير لنظير",
  };

  const displayText =
    methodTranslations[provider || method || ""] ||
    provider ||
    method ||
    "غير معروف";
  return <Badge variant="outline">{displayText}</Badge>;
};

// Format currency
const formatCurrency = (amount: number, currency: string = "DZD") => {
  return new Intl.NumberFormat("ar-DZ", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("ar-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

// Get item info (course or product)
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
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return (
        <div className="font-mono text-xs text-muted-foreground">
          {id.slice(-8)}
        </div>
      );
    },
  },

  {
    id: "student",
    header: "الطالب",
    cell: ({ row }) => {
      const payment = row.original;
      const student = payment.Student;

      if (!student) {
        return (
          <span className="text-muted-foreground text-sm">لا يوجد طالب</span>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={student.photo_url || undefined} />
            <AvatarFallback className="text-xs">
              {student.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{student.full_name}</span>
            <span className="text-xs text-muted-foreground">
              {student.email}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    id: "item",
    header: "العنصر",
    cell: ({ row }) => {
      const payment = row.original;
      const itemInfo = getItemInfo(payment);

      if (!itemInfo) {
        return <span className="text-muted-foreground text-sm">-</span>;
      }

      return (
        <div className="flex items-center gap-2">
          {itemInfo.thumbnail && (
            <img
              src={itemInfo.thumbnail}
              alt={itemInfo.title}
              className="h-8 w-8 rounded object-cover"
            />
          )}
          <div className="flex flex-col">
            <span
              className="text-sm font-medium truncate max-w-[150px]"
              title={itemInfo.title}
            >
              {itemInfo.title}
            </span>
            <span className="text-xs text-muted-foreground">
              {itemInfo.type}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "type",
    header: "النوع",
    cell: ({ row }) => {
      const type = row.getValue("type") as Payment["type"];
      return <PaymentTypeBadge type={type} />;
    },
  },

  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="flex items-center gap-1 font-semibold">
          <DollarSign className="h-3 w-3" />
          {formatCurrency(payment.amount, payment.currency)}
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as Payment["status"];
      return <StatusBadge status={status} />;
    },
  },

  {
    id: "paymentMethod",
    header: "طريقة الدفع",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <PaymentMethodBadge
          method={payment.method}
          provider={payment.MethodConfig?.provider}
        />
      );
    },
  },

  {
    id: "proofs",
    header: "الإثباتات",
    cell: ({ row }) => {
      const payment = row.original;
      const proofs = payment.Proofs || [];
      const verifiedProofs = proofs.filter((p) => p.verified);

      if (proofs.length === 0) {
        return (
          <span className="text-muted-foreground text-sm">لا توجد إثباتات</span>
        );
      }

      return (
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-xs">
            {verifiedProofs.length}/{proofs.length} مُؤكدة
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "تاريخ الإنشاء",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="text-sm text-muted-foreground">{formatDate(date)}</div>
      );
    },
  },

  {
    id: "actions",
    header: "الإجراءات",
    cell: ({ row }) => {
      const payment = row.original;
      const canApprove = payment.status === "PENDING";
      const canReject =
        payment.status === "PENDING" || payment.status === "PROCESSING";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">فتح القائمة</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              نسخ معرف الدفع
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Eye className="ml-2 h-4 w-4" />
              عرض التفاصيل
            </DropdownMenuItem>

            {canApprove && (
              <DropdownMenuItem className="text-green-600">
                <Check className="ml-2 h-4 w-4" />
                الموافقة على الدفع
              </DropdownMenuItem>
            )}

            {canReject && (
              <DropdownMenuItem className="text-red-600">
                <X className="ml-2 h-4 w-4" />
                رفض الدفع
              </DropdownMenuItem>
            )}

            {payment.Proofs && payment.Proofs.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  عرض الإثباتات ({payment.Proofs.length})
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
