"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { UserListItem } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function displayName(row: UserListItem): string {
  const name = row.user_name?.trim();
  if (name) return name;
  const first = row.firstName?.trim();
  const last = row.lastName?.trim();
  if (first || last) return [first, last].filter(Boolean).join(" ");
  return row.userId || "—";
}

export const UserColumns: ColumnDef<UserListItem>[] = [
  {
    id: "name",
    accessorFn: displayName,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{displayName(row.original)}</span>
    ),
  },
  {
    accessorKey: "support_email",
    header: "Email",
    cell: ({ row }) => (
      <span>{row.original.support_email ?? row.original.userId ?? "—"}</span>
    ),
  },
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-sm">
        {row.getValue("userId") as string}
      </span>
    ),
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
        return <Badge variant="default">Active</Badge>;
      return <Badge variant="secondary">Inactive</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return <span>{new Date(date).toLocaleDateString()}</span>;
    },
  },
];
