"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { UserListItem } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function displayName(row: UserListItem): string {
  const name = row.user_name?.trim();
  if (name) return name;
  const first = row.firstName?.trim();
  const last = row.lastName?.trim();
  if (first || last) return [first, last].filter(Boolean).join(" ");
  return row.userId || "—";
}

function displayEmail(row: UserListItem): string {
  const email = row.support_email?.trim();
  if (email && email.includes("@")) return email;
  return "—";
}

function formatSubscription(sub: UserListItem["subscription"]): string {
  if (!sub) return "—";
  const plan = sub.planCode.charAt(0) + sub.planCode.slice(1).toLowerCase();
  const cycle = sub.billingCycle === "MONTHLY" ? "Monthly" : "Yearly";
  return `${plan} (${cycle})`;
}

const sortableHeaderClass =
  "inline-flex items-center gap-1.5 rounded px-1 -mx-1 py-0.5 text-zinc-900 font-semibold bg-transparent hover:bg-zinc-200 transition-colors cursor-pointer";

export function getUsersColumns(
  onChangePlan: (accountId: string) => void
): ColumnDef<UserListItem>[] {
  return [
    {
      id: "name",
      accessorFn: displayName,
      header: ({ column }) => (
        <button
          type="button"
          className={sortableHeaderClass}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="h-4 w-4 text-zinc-600" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-medium text-zinc-900">{displayName(row.original)}</span>
      ),
    },
    {
      accessorKey: "support_email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-zinc-700">{displayEmail(row.original)}</span>
      ),
    },
    {
      accessorKey: "userId",
      header: "User ID",
      cell: ({ row }) => (
        <span className="text-zinc-500 font-mono text-sm">
          {row.getValue("userId") as string}
        </span>
      ),
    },
    {
      id: "subscription",
      accessorFn: (row) => formatSubscription(row.subscription),
      header: "Current plan",
      cell: ({ row }) => {
        const sub = row.original.subscription;
        if (!sub)
          return <span className="text-zinc-500">No plan</span>;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-zinc-700">{formatSubscription(sub)}</span>
            <div className="flex items-center gap-1.5">
              <Badge
                variant={sub.status === "ACTIVE" ? "default" : "secondary"}
                className={
                  sub.status === "ACTIVE"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-zinc-100 text-zinc-600 border-zinc-200"
                }
              >
                {sub.status}
              </Badge>
              <span className="text-xs text-zinc-500">
                Ends {new Date(sub.currentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "status",
      accessorFn: (row) => (row.isSuspended ? "suspended" : row.isActive ? "active" : "inactive"),
      header: "Status",
      cell: ({ row }) => {
        const suspended = row.original.isSuspended;
        const active = row.original.isActive;
        if (suspended)
          return <Badge variant="destructive">Suspended</Badge>;
        if (active)
          return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
        return <Badge variant="secondary">Inactive</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <button
          type="button"
          className={sortableHeaderClass}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="h-4 w-4 text-zinc-600" />
        </button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return <span className="text-zinc-700">{new Date(date).toLocaleDateString()}</span>;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          size="sm"
          className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 border-0 shadow-sm"
          onClick={() => onChangePlan(row.original.id)}
        >
          <Pencil className="h-3.5 w-3.5 mr-1.5" />
          Change plan
        </Button>
      ),
    },
  ];
}
