"use client";

import { DataTable } from "@/src/components/data-table";
import { usePaymentColumns } from "../components/columns/payments";
import type { Payment } from "../components/columns/payments";

interface PaymentsTableProps {
  data: Payment[];
}

export function PaymentsTable({ data }: PaymentsTableProps) {
  const columns = usePaymentColumns();
  return <DataTable columns={columns} data={data} />;
}
