"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@ui/components/ui/badge";
import { Button } from "@ui/components/ui/button";
import { ArrowUpDown, Eye } from "lucide-react";
import { format } from "date-fns";
import type { InvoiceWithDetails } from "../../actions/invoices.actions";
import Link from "next/link";

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

export const createInvoiceColumns = (): ColumnDef<InvoiceWithDetails>[] => [
  {
    accessorKey: "id",
    header: "Invoice ID",
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
          Amount
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
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={getStatusColor(status)} variant="secondary">
          {status.toLowerCase().replace("_", " ")}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "Payment",
    header: "Payment Info",
    cell: ({ row }) => {
      const payment = row.original.Payment;
      const appInstall = payment?.AppInstall?.[0];

      let itemInfo = "Unknown Item";
      let itemType = "Unknown";

      if (appInstall) {
        itemInfo = appInstall.App.name;
        itemType = "App Subscription";
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
              via {payment.method.toLowerCase().replace("_", " ")}
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
          Created
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
    header: "Due Date",
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as Date | null;
      const paidAt = row.original.paidAt;

      if (!dueDate) {
        return <span className="text-muted-foreground">No due date</span>;
      }

      const isOverdue = !paidAt && new Date(dueDate) < new Date();

      return (
        <div className="flex flex-col space-y-1">
          <span className={`text-sm ${isOverdue ? "text-red-600" : ""}`}>
            {format(new Date(dueDate), "MMM dd, yyyy")}
          </span>
          {isOverdue && (
            <Badge variant="destructive" className="text-xs w-fit">
              Overdue
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "paidAt",
    header: "Paid Date",
    cell: ({ row }) => {
      const paidAt = row.getValue("paidAt") as Date | null;

      if (!paidAt) {
        return <span className="text-muted-foreground">Not paid</span>;
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

// Export default columns without actions
export const invoiceColumns = createInvoiceColumns();

// Helper function to get status options for filtering
export const getStatusOptions = () => [
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Failed", value: "FAILED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Refunded", value: "REFUNDED" },
];

// Helper function to get sortable columns
export const getSortableColumns = () => [
  { label: "Created Date", value: "createdAt" },
  { label: "Amount", value: "amount" },
  { label: "Due Date", value: "dueDate" },
  { label: "Paid Date", value: "paidAt" },
];
