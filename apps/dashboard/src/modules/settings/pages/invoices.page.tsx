"use client";

import { DataTable } from "@/src/components/data-table";
import { useInvoiceColumns } from "../components/columns/invoices";

import { getAllInvoices } from "../actions/invoices.actions";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/src/components/loader-icon";

export default function InvoicesPage() {
  const columns = useInvoiceColumns();
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const res = await getAllInvoices();

      return res.invoices;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center ">
        <Loader size={16} />
      </div>
    );
  }

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
