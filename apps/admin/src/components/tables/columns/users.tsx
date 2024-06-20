"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Checkbox } from "@ui/components/ui/checkbox";
import { Account } from "database";
import { DataTableColumnHeader } from "../data-table-head";
import { formatDateInArabic } from "@/src/lib/utils";
import { Badge } from "@ui/components/ui/badge";
import { Crown } from "lucide-react";
import { openBlackKing } from "@/src/zustand/admin-state";

export const AccountColumns: ColumnDef<Account>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تاريخ الانضمام" />
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
    accessorKey: "user_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="حالة الحساب" />
    ),
    cell: ({ row }) => {
      return (
        <div className=" w-fit ">
          {row.original.verified ? (
            <Badge variant="default" className="bg-green-500 text-white">
              verified
            </Badge>
          ) : (
            <Badge variant="destructive">not verified</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "user_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="اسم الاستاذ" />
    ),

    cell: ({ row }) => {
      return (
        <p className=" text-sm font-bold ">
          {row.original.user_name ? row.original.user_name : "لا يوجد"}
        </p>
      );
    },
  },
  {
    accessorKey: "plan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="الخطة الحالية" />
    ),
    cell: ({ row }) => {
      return (
        <div className=" w-fit ">
          {row.original.plan === null ? (
            <Badge variant="destructive">free</Badge>
          ) : row.original.plan === "ADVANCED" ? (
            <Badge variant="default" className="bg-stone-800  text-white">
              advanced
            </Badge>
          ) : row.original.plan === "BASIC" ? (
            <Badge variant="default" className="bg-yellow-950 text-white">
              basic
            </Badge>
          ) : row.original.plan === "PRO" ? (
            <Badge variant="default" className="bg-purple-600  text-white">
              pro
            </Badge>
          ) : (
            <Badge variant="default" className="bg-black  text-white">
              black king
              <Crown className="w-4 h-4 text-white mr-2" strokeWidth={3} />
            </Badge>
          )}
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const { setId, setIsOpen } = openBlackKing();

      const popUpBlackKingModal = () => {
        setIsOpen(true);
        setId(row.original.id);
      };

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
              <DropdownMenuItem
                onClick={popUpBlackKingModal}
                className="w-full h-full flex justify-between items-center gap-x-2 px-2"
              >
                الترقية الى ملك اسود
                <Crown className="w-4 h-4 text-black" strokeWidth={3} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
