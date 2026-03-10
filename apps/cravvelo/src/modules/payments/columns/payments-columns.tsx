"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { PaymentListItem } from "../types";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function formatType(type: string): string {
  const labels: Record<string, string> = {
    BUYPRODUCT: "Buy product",
    BUYCOURSE: "Buy course",
    SUBSCRIPTION: "Subscription",
    REFERAL_WITHDRAWAL: "Referral withdrawal",
    REFUND: "Refund",
  };
  return labels[type] ?? type;
}

function formatMethod(method: string | null): string {
  if (!method) return "—";
  const labels: Record<string, string> = {
    CASH: "Cash",
    CHARGILY: "Chargily",
    BANK_TRANSFER: "Bank transfer",
    CREDIT_CARD: "Credit card",
  };
  return labels[method] ?? method;
}

function displayPayer(row: PaymentListItem): string {
  if (row.accountEmail) return row.accountName ? `${row.accountName} (${row.accountEmail})` : row.accountEmail;
  if (row.studentEmail) return row.studentName ? `${row.studentName} (${row.studentEmail})` : row.studentEmail;
  return "—";
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800 border-green-200";
    case "PENDING":
    case "PROCESSING":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-200";
    case "CANCELLED":
    case "REFUNDED":
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
    default:
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
  }
}

const sortableHeaderClass =
  "inline-flex items-center gap-1.5 rounded px-1 -mx-1 py-0.5 text-zinc-900 font-semibold bg-transparent hover:bg-zinc-200 transition-colors cursor-pointer";

export function getPaymentsColumns(): ColumnDef<PaymentListItem>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-zinc-500 font-mono text-xs truncate max-w-32 block" title={row.original.id}>
          {row.original.id.slice(-10)}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="text-zinc-900">{formatType(row.original.type)}</span>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <button
          type="button"
          className={sortableHeaderClass}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="h-4 w-4 text-zinc-500" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-semibold text-zinc-900">
          {row.original.amount.toLocaleString()} <span className="font-normal text-zinc-500 text-xs">{row.original.currency}</span>
        </span>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={statusBadgeClass(row.original.status)} variant="secondary">
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => (
        <span className="text-zinc-900">{formatMethod(row.original.method)}</span>
      ),
    },
    {
      id: "payer",
      accessorFn: displayPayer,
      header: "Payer",
      cell: ({ row }) => (
        <span className="text-zinc-900 text-sm max-w-48 truncate block font-medium" title={displayPayer(row.original)}>
          {displayPayer(row.original)}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <button
          type="button"
          className={sortableHeaderClass}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="h-4 w-4 text-zinc-500" />
        </button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return (
          <span className="text-zinc-900">
            {new Date(date).toLocaleString()}
          </span>
        );
      },
    },
    {
      accessorKey: "gatewayId",
      header: "Gateway ID",
      cell: ({ row }) => (
        <span className="text-zinc-500 font-mono text-xs truncate max-w-32 block" title={row.original.gatewayId ?? ""}>
          {row.original.gatewayId ?? "—"}
        </span>
      ),
    },
  ];
}
