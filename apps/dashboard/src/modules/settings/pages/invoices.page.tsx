"use client";

import { DataTable } from "@/src/components/data-table";
import { DataTableLoading } from "@/src/components/data-table/table-helpers/table-loading";
import { useInvoiceColumns } from "../components/columns/invoices";

import { getAllInvoices } from "../actions/invoices.actions";
import { useQuery } from "@tanstack/react-query";

export default function InvoicesPage() {
  const columns = useInvoiceColumns();
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await getAllInvoices();

      return res.invoices;
    },
    retry: 1,
  });

  if (isLoading || isFetching) {
    return (
      <div className="w-full min-h-[400px]">
        <DataTableLoading columnCount={6} rowCount={8} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Failed to load invoices."}
        </p>
        <button
          className="text-sm font-medium text-primary underline"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <DataTable columns={columns} data={data ?? []} />
    </div>
  );
}
