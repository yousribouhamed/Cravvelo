"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button, buttonVariants } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Checkbox } from "@ui/components/ui/checkbox";
import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { DataTableColumnHeader } from "../data-table-head";
import { Course } from "database";
import { Badge } from "@ui/components/ui/badge";
import { openCourseDeleteOrSuspandAction } from "@/src/zustand/admin-state";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const CourseColumns: ColumnDef<Course>[] = [
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="عنوان الدورة" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-2 justify-center items-start ">
          <Link href={`/courses/${row.original.id}/chapters`}>
            <p className="font-bold  hover:text-blue-500 cursor-pointer">
              {row.original.title}
            </p>
          </Link>

          <Badge className="bg-[#F5F5F5] hover:bg-[#F5F5F5] text-black rounded-md">
            {row.original.status === "DRAFT"
              ? "مسودة"
              : row.original.status === "PUBLISED"
              ? "منشور"
              : "خاص"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="السعر" />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-gray-500 text-sm">
          {" "}
          <span className="font-bold text-black">
            {row.original.price === null ? 0 : row.original.price}
          </span>{" "}
          دج
        </p>
      );
    },
  },
  {
    accessorKey: "profit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="إجمالي الأرباح" />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-gray-500 text-sm">
          {" "}
          <span className="font-bold text-black">
            {row.original.profit === null ? 0 : row.original.profit}
          </span>{" "}
          دج
        </p>
      );
    },
  },

  {
    accessorKey: "studenstNbr",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="    عدد الطلاب الملتحقين" />
    ),
    cell: ({ row }) => {
      return (
        <p>
          {row.original.studentsNbr === null ? 0 : row.original.studentsNbr}
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { setId, setIsOpen, setAction } = openCourseDeleteOrSuspandAction();

      const suspandCourse = () => {
        setId(row.original.id);
        setIsOpen(true);
        setAction("SUSPAND");
      };

      const deleteCourse = () => {
        setId(row.original.id);
        setIsOpen(true);
        setAction("DELETE");
      };
      return (
        <div className="w-full h-10 flex items-center justify-end gap-x-4">
          <Link
            href={`/courses/${row.original.id}/chapters`}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "bg-white rounded-xl border"
            )}
          >
            تعديل
          </Link>
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
                onClick={suspandCourse}
                className="w-full h-full flex justify-between items-center px-2 "
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
                تعليق الدورة
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={deleteCourse}
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
