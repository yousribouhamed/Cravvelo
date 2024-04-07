"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronsUpDown, MoreHorizontal } from "lucide-react";
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
import { DataTableColumnHeader } from "../data-table-head";
import { Product } from "database";
import { Badge } from "@ui/components/ui/badge";
import { maketoast } from "../../toasts";
import { useOpenProductDeleteAction } from "@/src/lib/zustand/delete-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const ProctsColumns: ColumnDef<Product>[] = [
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
      <DataTableColumnHeader column={column} title="عنوان المنتج" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-2 justify-center items-start ">
          <p className="font-bold ">{row.original.title}</p>
          <Badge className="bg-[#F5F5F5] hover:bg-[#F5F5F5] text-black rounded-md">
            {row.original.status}
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
            {row.original.price === null ? 0 : row.original.price}
          </span>{" "}
          دج
        </p>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      /* eslint-disable */
      const { setId, setIsOpen } = useOpenProductDeleteAction();

      return (
        <div className="w-full h-10 flex items-center justify-end gap-x-4">
          {/* <Link
            href={`/courses/${row.original.id}/chapters`}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "bg-white rounded-xl border"
            )}
          >
            تعديل
          </Link> */}
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
              <Link href={`/products/${row.original.id}/content`}>
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
                disabled
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
                    d="M4.81112 7.77128C4.6497 7.48082 4.39639 7.25219 4.09097 7.12127C3.78555 6.99035 3.4453 6.96455 3.12363 7.04793C2.80196 7.13131 2.51708 7.31914 2.31371 7.58195C2.11034 7.84475 2 8.16764 2 8.49994C2 8.83224 2.11034 9.15514 2.31371 9.41794C2.51708 9.68074 2.80196 9.86858 3.12363 9.95196C3.4453 10.0353 3.78555 10.0095 4.09097 9.87862C4.39639 9.7477 4.6497 9.51907 4.81112 9.22861M4.81112 7.77128C4.93112 7.98728 4.99979 8.23528 4.99979 8.49994C4.99979 8.76461 4.93112 9.01328 4.81112 9.22861M4.81112 7.77128L11.1885 4.22861M4.81112 9.22861L11.1885 12.7713M11.1885 4.22861C11.282 4.4047 11.4096 4.56039 11.564 4.68656C11.7184 4.81274 11.8964 4.90687 12.0875 4.96346C12.2787 5.02005 12.4793 5.03796 12.6774 5.01614C12.8756 4.99432 13.0675 4.93321 13.2417 4.83639C13.416 4.73956 13.5693 4.60896 13.6925 4.45222C13.8157 4.29548 13.9065 4.11575 13.9594 3.92353C14.0124 3.73132 14.0265 3.53047 14.0009 3.33274C13.9753 3.13501 13.9106 2.94436 13.8105 2.77194C13.6132 2.43217 13.2904 2.18337 12.9117 2.07902C12.5329 1.97467 12.1283 2.02311 11.7848 2.21391C11.4414 2.40472 11.1865 2.72267 11.075 3.09941C10.9634 3.47615 11.0042 3.8816 11.1885 4.22861ZM11.1885 12.7713C11.0928 12.9435 11.0319 13.1329 11.0095 13.3287C10.987 13.5245 11.0033 13.7227 11.0574 13.9122C11.1115 14.1016 11.2025 14.2786 11.325 14.4329C11.4475 14.5872 11.5992 14.7159 11.7715 14.8116C11.9437 14.9073 12.1331 14.9681 12.3289 14.9906C12.5246 15.0131 12.7229 14.9968 12.9124 14.9427C13.1018 14.8885 13.2788 14.7976 13.4331 14.6751C13.5874 14.5526 13.7161 14.4009 13.8118 14.2286C14.005 13.8807 14.0522 13.4703 13.9429 13.0877C13.8335 12.7051 13.5767 12.3815 13.2288 12.1883C12.8809 11.995 12.4705 11.9479 12.0879 12.0572C11.7052 12.1665 11.3817 12.4234 11.1885 12.7713Z"
                    stroke="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                مشاركة الدورة
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled
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
                    d="M1.35775 8.71467C1.31174 8.57639 1.31174 8.42694 1.35775 8.28867C2.28241 5.50667 4.90708 3.5 8.00041 3.5C11.0924 3.5 13.7157 5.50467 14.6424 8.28533C14.6891 8.42333 14.6891 8.57267 14.6424 8.71133C13.7184 11.4933 11.0937 13.5 8.00041 13.5C4.90841 13.5 2.28441 11.4953 1.35775 8.71467Z"
                    stroke="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10 8.5C10 9.03043 9.78929 9.53914 9.41421 9.91421C9.03914 10.2893 8.53043 10.5 8 10.5C7.46957 10.5 6.96086 10.2893 6.58579 9.91421C6.21071 9.53914 6 9.03043 6 8.5C6 7.96957 6.21071 7.46086 6.58579 7.08579C6.96086 6.71071 7.46957 6.5 8 6.5C8.53043 6.5 9.03914 6.71071 9.41421 7.08579C9.78929 7.46086 10 7.96957 10 8.5Z"
                    stroke="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                معاينة كطالب
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(payment.id);
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
                disabled
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
                    d="M9.99969 13.252C10.5683 13.4171 11.1576 13.5006 11.7497 13.5C12.702 13.5014 13.6418 13.2843 14.497 12.8653C14.5223 12.2678 14.3521 11.6783 14.0122 11.1862C13.6723 10.6941 13.1813 10.3262 12.6135 10.1383C12.0457 9.95043 11.4321 9.95275 10.8658 10.1449C10.2995 10.3371 9.81119 10.7087 9.47502 11.2033M9.99969 13.252V13.25C9.99969 12.508 9.80902 11.81 9.47502 11.2033M9.99969 13.252V13.3227C8.71668 14.0954 7.24676 14.5025 5.74902 14.5C4.19502 14.5 2.74102 14.07 1.49969 13.3227L1.49902 13.25C1.49851 12.3063 1.8121 11.3893 2.39035 10.6435C2.96859 9.89773 3.77861 9.36562 4.69268 9.13107C5.60676 8.89651 6.57291 8.97285 7.4388 9.34806C8.30469 9.72327 9.02108 10.376 9.47502 11.2033M7.99969 4.75C7.99969 5.34674 7.76264 5.91903 7.34068 6.34099C6.91872 6.76295 6.34643 7 5.74969 7C5.15295 7 4.58066 6.76295 4.1587 6.34099C3.73674 5.91903 3.49969 5.34674 3.49969 4.75C3.49969 4.15326 3.73674 3.58097 4.1587 3.15901C4.58066 2.73705 5.15295 2.5 5.74969 2.5C6.34643 2.5 6.91872 2.73705 7.34068 3.15901C7.76264 3.58097 7.99969 4.15326 7.99969 4.75ZM13.4997 6.25C13.4997 6.71413 13.3153 7.15925 12.9871 7.48744C12.6589 7.81563 12.2138 8 11.7497 8C11.2856 8 10.8404 7.81563 10.5123 7.48744C10.1841 7.15925 9.99969 6.71413 9.99969 6.25C9.99969 5.78587 10.1841 5.34075 10.5123 5.01256C10.8404 4.68437 11.2856 4.5 11.7497 4.5C12.2138 4.5 12.6589 4.68437 12.9871 5.01256C13.3153 5.34075 13.4997 5.78587 13.4997 6.25Z"
                    stroke="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                عرض الطلاب
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled
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
                    d="M7.65311 2.83265C7.6813 2.76387 7.72932 2.70503 7.79105 2.66362C7.85279 2.62221 7.92544 2.6001 7.99978 2.6001C8.07411 2.6001 8.14676 2.62221 8.2085 2.66362C8.27023 2.70503 8.31825 2.76387 8.34644 2.83265L9.76311 6.23998C9.78963 6.30374 9.83322 6.35894 9.88909 6.39952C9.94496 6.4401 10.0109 6.46448 10.0798 6.46998L13.7584 6.76465C14.0911 6.79131 14.2258 7.20665 13.9724 7.42331L11.1698 9.82465C11.1174 9.86944 11.0784 9.92778 11.057 9.99328C11.0356 10.0588 11.0326 10.1289 11.0484 10.196L11.9051 13.786C11.9223 13.858 11.9178 13.9335 11.8921 14.003C11.8665 14.0724 11.8208 14.1327 11.7609 14.1763C11.7009 14.2198 11.6295 14.2445 11.5555 14.2475C11.4815 14.2504 11.4083 14.2313 11.3451 14.1926L8.19511 12.2693C8.13627 12.2335 8.06869 12.2145 7.99978 12.2145C7.93086 12.2145 7.86328 12.2335 7.80444 12.2693L4.65444 14.1933C4.59128 14.232 4.51808 14.2511 4.44408 14.2481C4.37008 14.2452 4.29861 14.2204 4.23869 14.1769C4.17877 14.1334 4.13308 14.0731 4.10741 14.0036C4.08174 13.9342 4.07722 13.8587 4.09444 13.7866L4.95111 10.196C4.967 10.1289 4.96408 10.0588 4.94267 9.99325C4.92126 9.92773 4.8822 9.86939 4.82978 9.82465L2.02711 7.42331C1.97098 7.37505 1.93038 7.31128 1.91041 7.24C1.89043 7.16873 1.89198 7.09314 1.91485 7.02274C1.93772 6.95235 1.9809 6.89028 2.03895 6.84436C2.097 6.79844 2.16734 6.7707 2.24111 6.76465L5.91978 6.46998C5.98861 6.46448 6.05459 6.4401 6.11046 6.39952C6.16633 6.35894 6.20992 6.30374 6.23644 6.23998L7.65311 2.83265Z"
                    stroke="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                عرض التقييمات
              </DropdownMenuItem>
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
                حذف المنتج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
