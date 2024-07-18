"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Checkbox } from "@ui/components/ui/checkbox";
import { Certificate } from "database";
import { DataTableColumnHeader } from "../table-helpers/data-table-head";
import { formatDateInArabic } from "@/src/lib/utils";
import Link from "next/link";
import { useOpenCertificateDeleteAction } from "@/src/lib/zustand/delete-actions";

export const CertificateColumns: ColumnDef<Certificate>[] = [
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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="وقت الانشاء" />
    ),
    cell: ({ row }) => {
      return (
        <p className=" text-sm font-bold ">
          {formatDateInArabic(row.original.createdAt, "dd MMMM yyyy")}
        </p>
      );
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="اسم الشهادة" />
    ),
  },
  {
    accessorKey: "studentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="اسم الطالب" />
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      /* eslint-disable */
      const { setId, setIsOpen } = useOpenCertificateDeleteAction();

      return (
        <div className="w-full h-10 flex items-center justify-end gap-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className=" w-10 p-0 bg-white rounded-xl border"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuSeparator />

              <Link target="_blank" href={row.original.fileUrl}>
                <DropdownMenuItem className="w-full h-full flex justify-between items-center px-2">
                  <ExternalLink className="w-4 h-4 ml-2" />
                  عرض الشهادة
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem
                onClick={() => {
                  setId(row.original.id);
                  setIsOpen(true);
                }}
                className="w-full h-full flex justify-between items-center px-2 text-[#C23D2F]"
              >
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.82667 6.5001L9.596 12.5001M6.404 12.5001L6.17333 6.5001M12.8187 4.3601C13.0467 4.39477 13.2733 4.43144 13.5 4.47077M12.8187 4.3601L12.1067 13.6154C12.0776 13.9923 11.9074 14.3442 11.63 14.6009C11.3527 14.8577 10.9886 15.0002 10.6107 15.0001H5.38933C5.0114 15.0002 4.64735 14.8577 4.36999 14.6009C4.09262 14.3442 3.92239 13.9923 3.89333 13.6154L3.18133 4.3601M12.8187 4.3601C12.0492 4.24378 11.2758 4.1555 10.5 4.09544M3.18133 4.3601C2.95333 4.3941 2.72667 4.43077 2.5 4.4701M3.18133 4.3601C3.95076 4.24378 4.72416 4.1555 5.5 4.09544M10.5 4.09544V3.48477C10.5 2.6981 9.89333 2.0421 9.10667 2.01744C8.36908 1.99386 7.63092 1.99386 6.89333 2.01744C6.10667 2.0421 5.5 2.69877 5.5 3.48477V4.09544M10.5 4.09544C8.83581 3.96682 7.16419 3.96682 5.5 4.09544"
                    stroke="#C23D2F"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                حذف الدورة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
