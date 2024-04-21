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
import { Website } from "database";
import { DataTableColumnHeader } from "../data-table-head";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "@/src/app/_trpc/client";
import { maketoast } from "../../toasts";
import { Badge } from "@ui/components/ui/badge";

export const WebsiteColumns: ColumnDef<Website>[] = [
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
    accessorKey: "logo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="شعار الأكاديمية" />
    ),

    cell: ({ row }) => (
      <div className="min-w-[50px] w-fit h-[50px] flex items-center justify-center relative rounded-xl">
        {row.original.logo ? (
          <Image
            src={row.original.logo}
            alt={`${row.original.name} logo`}
            fill
            className="rounded-xl"
          />
        ) : (
          <Badge variant="destructive">لا يوجد</Badge>
        )}
      </div>
    ),
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="اسم الأكاديمية" />
    ),
  },

  {
    accessorKey: "subdomain",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="المجال الفرعي" />
    ),
    cell: ({ row }) => (
      <div className="w-[70px] h-[70px] flex items-center justify-center relative rounded-xl">
        <Link
          href={row.original.subdomain}
          className="text-blue-500 boder-b cursor-pointer"
        >
          {row.original.subdomain}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "customDomain",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="مجال مخصص" />
    ),
    cell: ({ row }) => (
      <div className="w-[70px] h-[70px] flex items-center justify-center relative rounded-xl">
        {row.original.customDomain ? (
          <Link
            href={row.original.customDomain ?? ""}
            className="text-blue-500 boder-b cursor-pointer"
          >
            {row.original.customDomain}
          </Link>
        ) : (
          <Badge variant="destructive">لا يوجد</Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "suspended",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="حالة الموقع" />
    ),
    cell: ({ row }) => {
      if (row.original.suspended) {
        return (
          <Badge variant="default" className="bg-green-500 text-white">
            فعال
          </Badge>
        );
      }

      return <Badge variant="destructive">غير فعال</Badge>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      const suspendWebsite = trpc.suspendWebSite.useMutation({
        onSuccess: () => {
          maketoast.successWithText({ text: "تم تعليق الموقع" });
          window.location.reload();
        },
        onError: () => {
          maketoast.errorWithTest({ text: "حدث خطأ ما أثناء تعليق الموقع" });
        },
      });

      const unSuspendWebSite = trpc.unSuspendWebSite.useMutation({
        onSuccess: () => {
          maketoast.successWithText({ text: "تم الغاء التعليق" });
          window.location.reload();
        },
        onError: () => {
          maketoast.errorWithTest({ text: "حدث خطأ ما أثناء  " });
        },
      });

      const delteWebsite = trpc.deletWebSite.useMutation({
        onSuccess: () => {
          maketoast.successWithText({ text: "تم حذف الموقع" });
          window.location.reload();
        },
        onError: () => {
          maketoast.errorWithTest({ text: "حدث خطأ ما أثناء حذف موقع الويب" });
        },
      });

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

              <DropdownMenuItem
                onClick={() =>
                  suspendWebsite.mutate({
                    id: row.original.id,
                  })
                }
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
                تعليق الموقع
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  unSuspendWebSite.mutate({
                    id: row.original.id,
                  })
                }
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
                الغاء تعليق الموقع
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  delteWebsite.mutate({
                    id: row.original.id,
                  })
                }
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
                حذف الاكاديمية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
