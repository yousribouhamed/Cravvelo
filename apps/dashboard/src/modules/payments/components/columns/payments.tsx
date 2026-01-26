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
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { maketoast } from "@/src/components/toasts";
import { PaymentProofModal } from "../payment-proof-modal";

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

// Date formatter - now accepts locale
const formatDate = (date: Date, locale: string) => {
  const localeMap: Record<string, string> = {
    ar: "ar-DZ",
    en: "en-US",
  };
  const dateLocale = localeMap[locale] || "en-US";
  return new Intl.DateTimeFormat(dateLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

// Status badge colors - theme-aware function
const getStatusBadgeVariant = (status: string, isDark: boolean) => {
  if (isDark) {
    switch (status) {
      case "COMPLETED":
        return "!border-green-700 !bg-green-900/40 !text-green-200";
      case "PENDING":
        return "!border-yellow-700 !bg-yellow-900/40 !text-yellow-200";
      case "PROCESSING":
        return "!border-blue-700 !bg-blue-900/40 !text-blue-200";
      case "FAILED":
        return "!border-red-700 !bg-red-900/40 !text-red-200";
      case "CANCELLED":
        return "!border-gray-700 !bg-gray-800 !text-gray-200";
      case "REFUNDED":
        return "!border-purple-700 !bg-purple-900/40 !text-purple-200";
      default:
        return "!border-gray-700 !bg-gray-800 !text-gray-200";
    }
  } else {
    switch (status) {
      case "COMPLETED":
        return "!border-green-200 !bg-green-100 !text-green-800";
      case "PENDING":
        return "!border-yellow-200 !bg-yellow-100 !text-yellow-800";
      case "PROCESSING":
        return "!border-blue-200 !bg-blue-100 !text-blue-800";
      case "FAILED":
        return "!border-red-200 !bg-red-100 !text-red-800";
      case "CANCELLED":
        return "!border-gray-200 !bg-gray-100 !text-gray-800";
      case "REFUNDED":
        return "!border-purple-200 !bg-purple-100 !text-purple-800";
      default:
        return "!border-gray-200 !bg-gray-100 !text-gray-800";
    }
  }
};

// Payment method badge colors - theme-aware function
const getMethodBadgeVariant = (method: string, isDark: boolean) => {
  if (isDark) {
    switch (method) {
      case "BANK_TRANSFER":
        return "!border-indigo-700 !bg-indigo-900/40 !text-indigo-200";
      case "CASH":
        return "!border-emerald-700 !bg-emerald-900/40 !text-emerald-200";
      case "CHARGILY":
        return "!border-orange-700 !bg-orange-900/40 !text-orange-200";
      case "CREDIT_CARD":
        return "!border-cyan-700 !bg-cyan-900/40 !text-cyan-200";
      default:
        return "!border-gray-700 !bg-gray-800 !text-gray-200";
    }
  } else {
    switch (method) {
      case "BANK_TRANSFER":
        return "!border-indigo-200 !bg-indigo-100 !text-indigo-800";
      case "CASH":
        return "!border-emerald-200 !bg-emerald-100 !text-emerald-800";
      case "CHARGILY":
        return "!border-orange-200 !bg-orange-100 !text-orange-800";
      case "CREDIT_CARD":
        return "!border-cyan-200 !bg-cyan-100 !text-cyan-800";
      default:
        return "!border-gray-200 !bg-gray-100 !text-gray-800";
    }
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

// item helper - now accepts translation function
const getItemInfo = (payment: Payment, t: (key: string) => string) => {
  if (payment.Sale?.Course) {
    return {
      type: t("payments.types.course"),
      title: payment.Sale.Course.title,
      thumbnail: payment.Sale.Course.thumbnailUrl,
    };
  } else if (payment.Sale?.Product) {
    return {
      type: t("payments.types.product"),
      title: payment.Sale.Product.title,
      thumbnail: payment.Sale.Product.thumbnailUrl,
    };
  } else if (payment.Subscription) {
    return {
      type: t("payments.types.subscription"),
      title: payment.Subscription.plan,
      thumbnail: null,
    };
  }
  return null;
};

// Actions Cell Component
const ActionsCell = ({ payment }: { payment: Payment }) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";
  const isBankTransfer = payment.method === "BANK_TRANSFER" || payment.MethodConfig?.provider === "P2P";
  const formattedAmount = formatCurrency({
    amount: payment.amount,
    currency: payment.currency as "DZD",
  });
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  // Copy to clipboard function with error handling and fallback
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        maketoast.successWithText({ text: t("payments.messages.copied") });
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          maketoast.successWithText({ text: t("payments.messages.copied") });
        } catch (err) {
          maketoast.errorWithText({ text: t("payments.errors.copyFailed") });
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      maketoast.errorWithText({ text: t("payments.errors.copyFailed") });
    }
  };

  // Approve payment mutation with confirmation
  const approvePaymentMutation = useConfirmation(
    async (paymentId: string) => {
      const result = await approvePayment({ paymentId });
      if (!result.success) {
        throw new Error(result.message || t("payments.errors.approveFailed"));
      }
      return result;
    },
    {
      confirmationConfig: {
        title: t("payments.confirmations.approveTitle"),
        description: t("payments.confirmations.approveDescription", {
          amount: formattedAmount,
        }),
        confirmText: t("payments.confirmations.approveConfirm"),
        cancelText: t("common.cancel"),
        variant: "default",
      },
      onSuccess: () => {
        maketoast.successWithText({ text: t("payments.messages.approveSuccess") });
        router.refresh(); // Refresh server components
      },
      onError: (error: any) => {
        const errorMessage = error?.message || error?.data?.message || t("payments.errors.approveFailed");
        maketoast.errorWithText({ text: errorMessage });
      },
    }
  );

  // Reject payment mutation with confirmation
  const rejectPaymentMutation = useConfirmation(
    async (paymentId: string) => {
      const result = await rejectPayment({ paymentId });
      if (!result.success) {
        throw new Error(result.message || t("payments.errors.rejectFailed"));
      }
      return result;
    },
    {
      confirmationConfig: {
        title: t("payments.confirmations.rejectTitle"),
        description: t("payments.confirmations.rejectDescription", {
          amount: formattedAmount,
        }),
        confirmText: t("payments.confirmations.rejectConfirm"),
        cancelText: t("common.cancel"),
        variant: "destructive",
      },
      onSuccess: () => {
        maketoast.successWithText({ text: t("payments.messages.rejectSuccess") });
        router.refresh(); // Refresh server components
      },
      onError: (error: any) => {
        const errorMessage = error?.message || error?.data?.message || t("payments.errors.rejectFailed");
        maketoast.errorWithText({ text: errorMessage });
      },
    }
  );

  return (
    <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">{t("payments.actions.openMenu")}</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={`bg-card text-card-foreground ${isRTL ? "text-right" : "text-left"}`}
      >
        <DropdownMenuLabel className={isRTL ? "text-right" : "text-left"}>
          {t("payments.columns.actions")}
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => copyToClipboard(payment.id)}
          className={isRTL ? "text-right" : "text-left"}
        >
          {t("payments.actions.copyPaymentId")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {/* Show payment proofs only for bank transfers */}
        {isBankTransfer && payment.Proofs && payment.Proofs.length > 0 && (
          <>
            <DropdownMenuItem
              className={isRTL ? "text-right" : "text-left"}
              onSelect={(e) => {
                e.preventDefault();
                // Use setTimeout to ensure dropdown closes before modal opens
                setTimeout(() => {
                  setIsProofModalOpen(true);
                }, 100);
              }}
            >
              <FileImage className={isRTL ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
              {t("payments.actions.viewProofs")} ({payment.Proofs.length})
            </DropdownMenuItem>
            <PaymentProofModal
              proofs={payment.Proofs}
              isOpen={isProofModalOpen}
              setIsOpen={setIsProofModalOpen}
            />
          </>
        )}

        {/* Show approve/reject actions only for bank transfers */}
        {isBankTransfer && payment.status === "PENDING" && (
          <DropdownMenuItem
            className={`text-green-600 dark:text-green-400 ${isRTL ? "text-right" : "text-left"}`}
            onClick={() =>
              approvePaymentMutation.mutateWithConfirmation(payment.id)
            }
            disabled={approvePaymentMutation.isLoading}
          >
            <Check className={isRTL ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
            {approvePaymentMutation.isLoading
              ? t("payments.actions.approving")
              : t("payments.actions.approvePayment")}
          </DropdownMenuItem>
        )}

        {isBankTransfer &&
          (payment.status === "PENDING" || payment.status === "PROCESSING") && (
            <DropdownMenuItem
              className={`text-red-600 dark:text-red-400 ${isRTL ? "text-right" : "text-left"}`}
              onClick={() =>
                rejectPaymentMutation.mutateWithConfirmation(payment.id)
              }
              disabled={rejectPaymentMutation.isLoading}
            >
              <X className={isRTL ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
              {rejectPaymentMutation.isLoading
                ? t("payments.actions.rejecting")
                : t("payments.actions.rejectPayment")}
            </DropdownMenuItem>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Column components that use translations
const IdCell = ({ id }: { id: string | null }) => {
  const t = useTranslations();
  if (!id) {
    return <span className="text-muted-foreground text-sm">{t("payments.emptyStates.noItem")}</span>;
  }
  return (
    <div className="font-mono text-xs text-muted-foreground">
      {id.slice(-8)}
    </div>
  );
};

const StudentCell = ({ student }: { student?: Payment["Student"] }) => {
  const t = useTranslations();
  if (!student)
    return (
      <span className="text-muted-foreground text-sm">
        {t("payments.emptyStates.noStudent")}
      </span>
    );
  return (
    <div className="flex items-center gap-2 min-w-[180px]">
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
          {student.email || t("payments.emptyStates.noItem")}
        </span>
      </div>
    </div>
  );
};

const ItemCell = ({ payment }: { payment: Payment }) => {
  const t = useTranslations();
  const info = getItemInfo(payment, t);
  if (!info)
    return <span className="text-muted-foreground text-sm">{t("payments.emptyStates.noItem")}</span>;
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
};

const StatusCell = ({ status }: { status: string | null }) => {
  const t = useTranslations();
  const { resolvedTheme } = useTheme();
  // resolvedTheme will be "dark" or "light" (or undefined during SSR)
  const isDark = resolvedTheme === "dark";
  
  if (!status) {
    return <span className="text-muted-foreground text-sm">{t("payments.emptyStates.noItem")}</span>;
  }
  return (
    <Badge variant="outline" className={getStatusBadgeVariant(status, isDark)}>
      {t(`payments.status.${status}`)}
    </Badge>
  );
};

const PaymentMethodCell = ({ method }: { method: string | null | undefined }) => {
  const t = useTranslations();
  const { resolvedTheme } = useTheme();
  // resolvedTheme will be "dark" or "light" (or undefined during SSR)
  const isDark = resolvedTheme === "dark";
  
  if (!method || method === "-") {
    return <Badge variant="outline" className={getMethodBadgeVariant("", isDark)}>{t("payments.emptyStates.noMethod")}</Badge>;
  }
  const methodKey = method.toUpperCase().replace(/-/g, "_") as "CASH" | "CHARGILY" | "BANK_TRANSFER" | "CREDIT_CARD";
  const translatedMethod = t(`payments.methods.${methodKey}`) || method;
  return (
    <Badge variant="outline" className={getMethodBadgeVariant(method, isDark)}>
      {translatedMethod}
    </Badge>
  );
};

// Hook to get payment columns with translations
export const usePaymentColumns = (): ColumnDef<Payment>[] => {
  const t = useTranslations();
  const locale = useLocale();
  
  return [
    {
      accessorKey: "id",
      header: t("payments.columns.id"),
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        return <IdCell id={id} />;
      },
    },
    {
      id: "student",
      header: t("payments.columns.student"),
      cell: ({ row }) => {
        return <StudentCell student={row.original.Student} />;
      },
    },
    {
      id: "item",
      header: t("payments.columns.item"),
      cell: ({ row }) => {
        return <ItemCell payment={row.original} />;
      },
    },
    {
      accessorKey: "amount",
      header: t("payments.columns.amount"),
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="font-semibold">
            {formatCurrency({
              amount: p.amount,
              currency: (p.currency || "DZD") as "DZD",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("payments.columns.status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <StatusCell status={status} />;
      },
    },
    {
      id: "paymentMethod",
      header: t("payments.columns.paymentMethod"),
      cell: ({ row }) => {
        const method =
          row.original.method || row.original.MethodConfig?.provider || null;
        return <PaymentMethodCell method={method} />;
      },
    },
    {
      accessorKey: "createdAt",
      header: t("payments.columns.createdAt"),
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as Date;
        if (!createdAt) {
          return <span className="text-muted-foreground text-sm">-</span>;
        }
        return (
          <div className="text-sm text-muted-foreground w-fit">
            {formatDate(createdAt, locale)}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: t("payments.columns.actions"),
      cell: ({ row }) => <ActionsCell payment={row.original} />,
    },
  ];
};

// Export default columns for backward compatibility (will be translated in cells)
export const paymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <IdCell id={id} />;
    },
  },
  {
    id: "student",
    header: "Student",
    cell: ({ row }) => {
      return <StudentCell student={row.original.Student} />;
    },
  },
  {
    id: "item",
    header: "Item",
    cell: ({ row }) => {
      return <ItemCell payment={row.original} />;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const p = row.original;
      return (
        <div className="font-semibold">
          {formatCurrency({
            amount: p.amount,
            currency: (p.currency || "DZD") as "DZD",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <StatusCell status={status} />;
    },
  },
  {
    id: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const method =
        row.original.method || row.original.MethodConfig?.provider || null;
      return <PaymentMethodCell method={method} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      if (!createdAt) {
        return <span className="text-muted-foreground text-sm">-</span>;
      }
      return (
        <div className="text-sm text-muted-foreground w-fit">
          {formatDate(createdAt)}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell payment={row.original} />,
  },
];
