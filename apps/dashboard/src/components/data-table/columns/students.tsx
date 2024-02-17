"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@ui/components/ui/checkbox";
import { Student } from "database";
import { DataTableColumnHeader } from "../data-table-head";

export const StudentsColumns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        //@ts-ignore
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="!mr-4"
      />
    ),

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="!mr-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="اسم العائلة" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-2 justify-center items-start ">
          <p className="font-bold text-xs ">{row.original?.firstName}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title=" اسم الطالب" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-2 justify-center items-start ">
          <p className="font-bold text-xs ">{row.original?.lastName}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="البريد الالكتروني" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-2 justify-center items-start ">
          <p className="font-bold text-[10px]">{row.original?.email}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="رقم الهاتف" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-2 justify-center items-start ">
          <p className="font-bold text-xs">
            {row.original?.phone ?? "لا يوجد"}
          </p>
        </div>
      );
    },
  },
];
