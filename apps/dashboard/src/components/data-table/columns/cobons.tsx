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
import { DataTableColumnHeader } from "../data-table-head";
import { Coupon } from "database";
import { Badge } from "@ui/components/ui/badge";
import { maketoast } from "../../toasts";
import { formatDateInArabic } from "@/src/lib/utils";

export const CouponColumns: ColumnDef<Coupon>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="الرمز" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center w-[100px]  gap-x-2">
          <p className="font-bold  text-sm ">{row.original.code}</p>
          <Button
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(row.original.code);
              maketoast.info();
            }}
            variant="ghost"
            className="w-8 h-8 hover:bg-gray-600  transition-all duration-500 "
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
          </Button>
        </div>
      );
    },
  },

  {
    accessorKey: "discountType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نمط التخفيض" />
    ),
    cell: ({ row }) => {
      return (
        <p className="font-bold text-sm">
          {row.original.discountType === "FIXED_AMOUNT"
            ? "قيمة ثابتة"
            : "نسبة مئوية"}
        </p>
      );
    },
  },
  {
    accessorKey: "discountAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="كمية التخفيض" />
    ),
    cell: ({ row }) => {
      return (
        <p className=" text-sm font-bold ">
          {" "}
          {row.original.discountType === "FIXED_AMOUNT"
            ? `DZD ${row.original.discountAmount}`
            : `% ${row.original.discountAmount}`}
        </p>
      );
    },
  },
  {
    accessorKey: "expirationDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تاريخ نهاية الفعالية" />
    ),
    cell: ({ row }) => {
      return (
        <p className=" text-sm font-bold ">
          {formatDateInArabic(row.original.expirationDate, "dd MMMM yyyy")}
        </p>
      );
    },
  },
  {
    accessorKey: "usageLimit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="حدود الاستعمال" />
    ),
    cell: ({ row }) => {
      return (
        <p className=" text-sm font-bold ">
          {row.original.usageLimit === null ? 0 : row.original.usageLimit}
        </p>
      );
    },
  },
  {
    accessorKey: "usageCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="عدد الاستخدام" />
    ),
    cell: ({ row }) => {
      return (
        <p className=" text-sm font-bold ">
          {row.original.usageCount === null ? 0 : row.original.usageCount}
        </p>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="الحالة" />
    ),
    cell: ({ row }) => {
      const isActive = row.original?.isActive;
      return (
        <div>
          {row.original.isArchive ? (
            <Badge className="bg-black hover:bg-black text-white rounded-lg shadow-md">
              مؤرشف
            </Badge>
          ) : isActive ? (
            <Badge className="bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md">
              مفعل
            </Badge>
          ) : (
            <Badge className="bg-red-500  hover:bg-red-600 text-white rounded-lg shadow-md">
              غير فعال
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

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
                onClick={() => {
                  navigator.clipboard.writeText(payment.code);
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
                استنساخ الرمز
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuSeparator />

              <DropdownMenuItem className="w-full h-full flex justify-between items-center px-2">
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.65311 2.83265C7.6813 2.76387 7.72932 2.70503 7.79105 2.66362C7.85279 2.62221 7.92544 2.6001 7.99978 2.6001C8.07411 2.6001 8.14676 2.62221 8.2085 2.66362C8.27023 2.70503 8.31825 2.76387 8.34644 2.83265L9.76311 6.23998C9.78963 6.30374 9.83322 6.35894 9.88909 6.39952C9.94496 6.4401 10.0109 6.46448 10.0798 6.46998L13.7584 6.76465C14.0911 6.79131 14.2258 7.20665 13.9724 7.42331L11.1698 9.82465C11.1174 9.86944 11.0784 9.92778 11.057 9.99328C11.0356 10.0588 11.0326 10.1289 11.0484 10.196L11.9051 13.786C11.9223 13.858 11.9178 13.9335 11.8921 14.003C11.8665 14.0724 11.8208 14.1327 11.7609 14.1763C11.7009 14.2198 11.6295 14.2445 11.5555 14.2475C11.4815 14.2504 11.4083 14.2313 11.3451 14.1926L8.19511 12.2693C8.13627 12.2335 8.06869 12.2145 7.99978 12.2145C7.93086 12.2145 7.86328 12.2335 7.80444 12.2693L4.65444 14.1933C4.59128 14.232 4.51808 14.2511 4.44408 14.2481C4.37008 14.2452 4.29861 14.2204 4.23869 14.1769C4.17877 14.1334 4.13308 14.0731 4.10741 14.0036C4.08174 13.9342 4.07722 13.8587 4.09444 13.7866L4.95111 10.196C4.967 10.1289 4.96408 10.0588 4.94267 9.99325C4.92126 9.92773 4.8822 9.86939 4.82978 9.82465L2.02711 7.42331C1.97098 7.37505 1.93038 7.31128 1.91041 7.24C1.89043 7.16873 1.89198 7.09314 1.91485 7.02274C1.93772 6.95235 1.9809 6.89028 2.03895 6.84436C2.097 6.79844 2.16734 6.7707 2.24111 6.76465L5.91978 6.46998C5.98861 6.46448 6.05459 6.4401 6.11046 6.39952C6.16633 6.35894 6.20992 6.30374 6.23644 6.23998L7.65311 2.83265Z"
                    stroke="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                ارشفة القسيمة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
