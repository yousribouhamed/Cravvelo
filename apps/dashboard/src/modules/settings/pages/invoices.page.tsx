"use client";

import { DataTable } from "@/src/components/data-table";
import { createInvoiceColumns } from "../components/columns/invoices";

import { getAllInvoices } from "../actions/invoices.actions";
import { useQuery } from "@tanstack/react-query";
import { CravveloSpinner } from "@/src/components/cravvelo-spinner";

export default function InvoicesPage() {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const res = await getAllInvoices();

      return res.invoices;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center ">
        <CravveloSpinner />
      </div>
    );
  }

  return (
    <div>
      <DataTable columns={createInvoiceColumns()} data={data} />
    </div>
  );
}
