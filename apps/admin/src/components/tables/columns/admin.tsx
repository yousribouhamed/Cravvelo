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
import { Admin } from "database";
import { DataTableColumnHeader } from "../data-table-head";
import { openAdminDeleteAction } from "@/src/zustand/admin-state";
import { maketoast } from "../../toasts";

export const AdminColumns: ColumnDef<Admin>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="اسم المشرف" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="البريد الإلكتروني المشرف" />
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const { setId, setIsOpen } = openAdminDeleteAction();

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
                onClick={() => {
                  navigator.clipboard.writeText(row.original.email);
                  maketoast.info();
                }}
                className="w-full h-full flex justify-between items-center px-2"
              >
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5 12V14.25C10.5 14.664 10.164 15 9.75 15H3.25C3.05109 15 2.86032 14.921 2.71967 14.7803C2.57902 14.6397 2.5 14.4489 2.5 14.25V5.75C2.5 5.336 2.836 5 3.25 5H4.5C4.83505 4.99977 5.16954 5.02742 5.5 5.08267M10.5 12H12.75C13.164 12 13.5 11.664 13.5 11.25V8C13.5 5.02667 11.338 2.55933 8.5 2.08267C8.16954 2.02742 7.83505 1.99977 7.5 2H6.25C5.836 2 5.5 2.336 5.5 2.75V5.08267M10.5 12H6.25C6.05109 12 5.86032 11.921 5.71967 11.7803C5.57902 11.6397 5.5 11.4489 5.5 11.25V5.08267M13.5 9.5V8.25C13.5 7.65326 13.2629 7.08097 12.841 6.65901C12.419 6.23705 11.8467 6 11.25 6H10.25C10.0511 6 9.86032 5.92098 9.71967 5.78033C9.57902 5.63968 9.5 5.44891 9.5 5.25V4.25C9.5 3.95453 9.4418 3.66195 9.32873 3.38896C9.21566 3.11598 9.04992 2.86794 8.84099 2.65901C8.63206 2.45008 8.38402 2.28435 8.11104 2.17127C7.83806 2.0582 7.54547 2 7.25 2H6.5"
                    stroke="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                استنساخ
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  setId(row.original.id);
                  setIsOpen(true);
                }}
                className="w-full h-full flex justify-between items-center px-2"
              >
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5 12V14.25C10.5 14.664 10.164 15 9.75 15H3.25C3.05109 15 2.86032 14.921 2.71967 14.7803C2.57902 14.6397 2.5 14.4489 2.5 14.25V5.75C2.5 5.336 2.836 5 3.25 5H4.5C4.83505 4.99977 5.16954 5.02742 5.5 5.08267M10.5 12H12.75C13.164 12 13.5 11.664 13.5 11.25V8C13.5 5.02667 11.338 2.55933 8.5 2.08267C8.16954 2.02742 7.83505 1.99977 7.5 2H6.25C5.836 2 5.5 2.336 5.5 2.75V5.08267M10.5 12H6.25C6.05109 12 5.86032 11.921 5.71967 11.7803C5.57902 11.6397 5.5 11.4489 5.5 11.25V5.08267M13.5 9.5V8.25C13.5 7.65326 13.2629 7.08097 12.841 6.65901C12.419 6.23705 11.8467 6 11.25 6H10.25C10.0511 6 9.86032 5.92098 9.71967 5.78033C9.57902 5.63968 9.5 5.44891 9.5 5.25V4.25C9.5 3.95453 9.4418 3.66195 9.32873 3.38896C9.21566 3.11598 9.04992 2.86794 8.84099 2.65901C8.63206 2.45008 8.38402 2.28435 8.11104 2.17127C7.83806 2.0582 7.54547 2 7.25 2H6.5"
                    stroke="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                حذف المشرف
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
