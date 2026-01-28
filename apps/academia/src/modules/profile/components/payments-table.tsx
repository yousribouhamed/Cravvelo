"use client";

import { DataTable } from "./data-table";
import { PaymentColumns } from "./columns/payments";

interface PaymentsTableProps {
  data: any[];
}

export function PaymentsTable({ data }: PaymentsTableProps) {
  return <DataTable columns={PaymentColumns()} data={data} />;
}
