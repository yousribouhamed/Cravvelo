"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@ui/components/ui/badge";
import { Button } from "@ui/components/ui/button";
import { ArrowUpDown, Eye } from "lucide-react";
import { format } from "date-fns";
import type { InvoiceWithDetails } from "../../actions/invoices.actions";
import Link from "next/link";
import { useTranslations } from "next-intl";

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "FAILED":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "CANCELLED":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    case "REFUNDED":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

// Format currency
const formatCurrency = (amount: number, currency: string = "DZD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "DZD" ? "DZD" : currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

// Get customer initials for avatar fallback
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const useInvoiceColumns = (): ColumnDef<InvoiceWithDetails>[] => {
  const t = useTranslations("invoices");

  // Translate status using translations
  const translateStatus = (status: string): string => {
    const statusKey = status.toUpperCase().toLowerCase();
    const statusMap: Record<string, string> = {
      pending: t("status.pending"),
      processing: t("status.processing"),
      completed: t("status.completed"),
      failed: t("status.failed"),
      cancelled: t("status.cancelled"),
      refunded: t("status.refunded"),
    };
    return statusMap[statusKey] || status;
  };

  return [
  {
    accessorKey: "id",
    header: t("columns.invoiceNumber"),
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return (
        <div className="font-mono text-sm">#{id.slice(-8).toUpperCase()}</div>
      );
    },
  },

  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          {t("columns.amount")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const currency = row.original.currency;
      return (
        <div className="font-semibold">{formatCurrency(amount, currency)}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: t("columns.status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={getStatusColor(status)} variant="secondary">
          {translateStatus(status)}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "Payment",
    header: t("columns.paymentInfo"),
    cell: ({ row }) => {
      const payment = row.original.Payment;
      const appInstall = payment?.AppInstall?.[0];

      let itemInfo = t("payment.unknownItem");
      let itemType = t("payment.unknownType");

      if (appInstall) {
        itemInfo = appInstall.App.name;
        itemType = t("payment.appSubscription");
      }

      return (
        <div className="flex flex-col space-y-1">
          <span
            className="font-medium text-sm truncate max-w-[200px]"
            title={itemInfo}
          >
            {itemInfo}
          </span>
          <span className="text-xs text-muted-foreground">{itemType}</span>
          {payment?.method && (
            <span className="text-xs text-muted-foreground">
              {t("payment.via")} {payment.method.toLowerCase().replace("_", " ")}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent"
        >
          {t("columns.created")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="flex flex-col space-y-1">
          <span className="text-sm">
            {format(new Date(date), "MMM dd, yyyy")}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(date), "HH:mm")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: t("columns.dueDate"),
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as Date | null;
      const paidAt = row.original.paidAt;

      if (!dueDate) {
        return <span className="text-muted-foreground">{t("payment.noDueDate")}</span>;
      }

      const isOverdue = !paidAt && new Date(dueDate) < new Date();

      return (
        <div className="flex flex-col space-y-1">
          <span className={`text-sm ${isOverdue ? "text-red-600" : ""}`}>
            {format(new Date(dueDate), "MMM dd, yyyy")}
          </span>
          {isOverdue && (
            <Badge variant="destructive" className="text-xs w-fit">
              {t("payment.overdue")}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "paidAt",
    header: t("columns.paidDate"),
    cell: ({ row }) => {
      const paidAt = row.getValue("paidAt") as Date | null;

      if (!paidAt) {
        return <span className="text-muted-foreground">{t("payment.notPaid")}</span>;
      }

      return (
        <div className="flex flex-col space-y-1">
          <span className="text-sm">
            {format(new Date(paidAt), "MMM dd, yyyy")}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(paidAt), "HH:mm")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col space-y-1">
          <Link href={`/settings/invoices/${row.original.id}`}>
            <Button size="icon" variant="ghost">
              <Eye />
            </Button>
          </Link>
        </div>
      );
    },
  },
  ];
};

// Legacy export for backward compatibility (deprecated - use useInvoiceColumns hook instead)
export const createInvoiceColumns = useInvoiceColumns;

// Helper function to get status options for filtering
export const useStatusOptions = () => {
  const t = useTranslations("invoices");
  return [
    { label: t("status.pending"), value: "PENDING" },
    { label: t("status.processing"), value: "PROCESSING" },
    { label: t("status.completed"), value: "COMPLETED" },
    { label: t("status.failed"), value: "FAILED" },
    { label: t("status.cancelled"), value: "CANCELLED" },
    { label: t("status.refunded"), value: "REFUNDED" },
  ];
};

// Helper function to get sortable columns
export const useSortableColumns = () => {
  const t = useTranslations("invoices");
  return [
    { label: t("columns.created"), value: "createdAt" },
    { label: t("columns.amount"), value: "amount" },
    { label: t("columns.dueDate"), value: "dueDate" },
    { label: t("columns.paidDate"), value: "paidAt" },
  ];
};
