"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../table/data-table";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "عنوان الدورة",
  },
  {
    accessorKey: "email",
    header: "السعر",
  },
  {
    accessorKey: "amount",
    header: "إجمالي الأرباح",
  },
  {
    accessorKey: "email",
    header: "المدربين",
  },
  {
    accessorKey: "amount",
    header: "عدد الطلاب الملتحقين",
  },
];

export default function CoursesShell({ data }: { data: Payment[] }) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
