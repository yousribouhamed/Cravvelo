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
import { maketoast } from "../../toasts";
import { useOpenCourseDeleteAction } from "@/src/lib/zustand/delete-actions";
import { timeSince } from "@/src/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

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
    id: "title",
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
    id: "price",
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
          DZD
        </p>
      );
    },
  },
  {
    id: "level",
    accessorKey: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title=" المستوى" />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-gray-500 text-sm">
          {" "}
          <span className="font-bold text-black">
            {row.original.level === "BEGINNER" ? "مبتدئ" : "غير محدد"}
          </span>{" "}
        </p>
      );
    },
  },

  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تاريخ الانشاء" />
    ),
    cell: ({ row }) => {
      return <p>{timeSince(row.original.createdAt)}</p>;
    },
  },

  {
    id: "studenstNbr",
    accessorKey: "studenstNbr",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="عدد الطلاب الملتحقين" />
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
      const payment = row.original;
      /* eslint-disable */
      const { setId, setIsOpen } = useOpenCourseDeleteAction();

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
              <Link href={`/courses/${row.original.id}/chapters`}>
                <DropdownMenuItem className="w-full h-full flex justify-between items-center px-2">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.2413 3.49125L12.366 2.36592C12.6005 2.13147 12.9184 1.99976 13.25 1.99976C13.5816 1.99976 13.8995 2.13147 14.134 2.36592C14.3685 2.60037 14.5002 2.91836 14.5002 3.24992C14.5002 3.58149 14.3685 3.89947 14.134 4.13392L7.05467 11.2133C6.70222 11.5655 6.26758 11.8244 5.79 11.9666L4 12.4999L4.53333 10.7099C4.67552 10.2323 4.93442 9.7977 5.28667 9.44525L11.2413 3.49125ZM11.2413 3.49125L13 5.24992M12 9.83325V12.9999C12 13.3977 11.842 13.7793 11.5607 14.0606C11.2794 14.3419 10.8978 14.4999 10.5 14.4999H3.5C3.10218 14.4999 2.72064 14.3419 2.43934 14.0606C2.15804 13.7793 2 13.3977 2 12.9999V5.99992C2 5.6021 2.15804 5.22057 2.43934 4.93926C2.72064 4.65796 3.10218 4.49992 3.5 4.49992H6.66667"
                      stroke="black"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  تعديل
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(payment.title);
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

              <DropdownMenuSeparator />
              <Link href={`/students/comments`}>
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
                  عرض التقييمات
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />

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
