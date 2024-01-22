"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button, buttonVariants } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Checkbox } from "@ui/components/ui/checkbox";
import Link from "next/link";
import { cn } from "@ui/lib/utils";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Course = {
  id: string;
  title: string;
  price: number;
  studenstNbr: string;
  profit: string;
};

export const columns: ColumnDef<Course>[] = [
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
    accessorKey: "title",
    header: "عنوان الدورة",
  },
  {
    accessorKey: "price",
    header: "السعر ",
  },
  {
    accessorKey: "profit",
    header: "إجمالي الأرباح",
  },
  {
    accessorKey: "profit",
    header: "المدربين",
  },
  {
    accessorKey: "studenstNbr",
    header: "عدد الطلاب الملتحقين",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div className="w-full h-10 flex items-center justify-end gap-x-4">
          <Link
            href={`/courses/${row.original.id}/chapters`}
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            تعديل
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="h-8 w-10 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="w-full h-full flex justify-end items-center px-2"
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                تعديل
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="w-full h-full flex justify-end items-center px-2 ">
                {" "}
                مشاركة الدورة
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="w-full h-full flex justify-end items-center  px-2">
                {" "}
                معاينة كطالب
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="w-full h-full flex justify-end items-center px-2">
                {" "}
                استنساخ
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="w-full h-full flex justify-end items-center px-2">
                {" "}
                عرض الطلاب
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="w-full h-full flex justify-end items-center px-2">
                {" "}
                عرض التقييمات
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="w-full h-full flex justify-end items-center px-2">
                {" "}
                حذف الدورة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
