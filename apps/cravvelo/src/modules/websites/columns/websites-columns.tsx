"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { WebsiteListItem } from "../types";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sortableHeaderClass =
  "inline-flex items-center gap-1.5 rounded px-1 -mx-1 py-0.5 text-zinc-900 font-semibold bg-transparent hover:bg-zinc-200 transition-colors cursor-pointer";

function getStorefrontUrl(subdomain: string | null): string | null {
  if (!subdomain?.trim()) return null;
  const base = process.env.NEXT_PUBLIC_ACADEMIA_BASE_URL || "";
  if (!base) return null;
  try {
    const url = new URL(base);
    url.hostname = `${subdomain}.${url.hostname}`;
    return url.toString();
  } catch {
    return null;
  }
}

export const WebsiteColumns: ColumnDef<WebsiteListItem>[] = [
  {
    accessorKey: "name",
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
      <span className="font-medium text-zinc-900">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "subdomain",
    header: "Subdomain",
    cell: ({ row }) => (
      <span className="text-zinc-500 font-mono text-sm">
        {row.original.subdomain ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "customDomain",
    header: "Custom domain",
    cell: ({ row }) => (
      <span className="text-zinc-500 text-sm">
        {row.original.customDomain ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "ownerName",
    header: "Owner",
    cell: ({ row }) => (
      <span className="text-zinc-700">{row.original.ownerName}</span>
    ),
  },
  {
    id: "status",
    accessorFn: (row) => (row.suspended ? "suspended" : "active"),
    header: "Status",
    cell: ({ row }) => {
      const suspended = row.original.suspended;
      return suspended ? (
        <Badge variant="destructive">Suspended</Badge>
      ) : (
        <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      );
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
    cell: ({ row }) => {
      const url = getStorefrontUrl(row.original.subdomain);
      if (!url) return null;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-zinc-700 hover:text-zinc-900 hover:underline"
        >
          Open
          <ExternalLink className="h-3 w-3" />
        </a>
      );
    },
  },
];
