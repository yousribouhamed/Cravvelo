"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AppType } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

export const AppColumns: ColumnDef<AppType>[] = [
  {
    accessorKey: "name",
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
      <div className="flex items-center justify-start gap-x-4">
        <img
          src={row.original.logoUrl ?? "/default-applogo.png"}
          alt={row.original.name}
          className="w-10 h-10 rounded-xl shadow border shrink-0"
        />
        <p className="text-gray-500 font-bold">{row.getValue("name")}</p>
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => <span>{row.getValue("slug")}</span>,
  },
  {
    accessorKey: "shortDesc",
    header: "Short Description",
    cell: ({ row }) => <span>{row.getValue("shortDesc")}</span>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <span>{row.getValue("category") ?? "-"}</span>,
  },
  {
    accessorKey: "installationsCount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Installations
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.getValue("installationsCount")}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return <span>{new Date(date).toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date;
      return <span>{new Date(date).toLocaleDateString()}</span>;
    },
  },

  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      return (
        <Link
          href={`/applications/${row.original.id}`}
          className="underline text-blue hover:cursor-pointer text-blue-500"
        >
          view
        </Link>
      );
    },
  },
];
