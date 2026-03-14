"use client";
import { DataTable } from "@/src/components/data-table/tables";
import { Sale } from "database";
import type { FC } from "react";
import { useState, useCallback, useMemo } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { OrderColumns } from "@/src/components/data-table/columns/orders";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-helpers/table-loading";
import { useTranslations } from "next-intl";

const PAGE_SIZE = 10;

interface OrdersTableShellProps {
  initialData: {
    orders: Sale[];
    totalCount: number;
    pageCount: number;
    currentPage: number;
  };
}

const OrdersTableShell: FC<OrdersTableShellProps> = ({ initialData }) => {
  const t = useTranslations("dataTable.bulkActions");
  const isMounted = useMounted();
  const [page, setPage] = useState(1);

  const handleExportSelected = useCallback((selected: Sale[]) => {
    if (selected.length === 0) return;
    const headers = ["Order Number", "Amount", "Item Type", "Created At"];
    const rows = selected.map((s) => [
      s.orderNumber ?? "",
      String(s.price ?? s.amount ?? ""),
      s.itemType ?? "",
      new Date(s.createdAt).toISOString().slice(0, 10),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const bulkActions = useMemo(
    () => [{ label: t("exportSelected"), onClick: handleExportSelected }],
    [t, handleExportSelected]
  );

  const { data, refetch, isLoading } = trpc.getAllOrders.useQuery(
    { page, limit: PAGE_SIZE },
    {
      initialData,
      refetchOnWindowFocus: false,
    }
  );

  const orders = data?.orders ?? [];
  const totalCount = data?.totalCount ?? 0;
  const pageCount = data?.pageCount ?? 1;
  const currentPage = data?.currentPage ?? 1;
  const hasData = orders.length > 0 || (initialData?.orders?.length ?? 0) > 0;
  const showLoader = isLoading && !hasData;

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  if (!isMounted && !hasData) {
    return <DataTableLoading hideSearch columnCount={6} />;
  }
  if (!isMounted && hasData) {
    return (
      <div className="w-full min-h-[300px] h-fit flex flex-col ">
        <DataTable
          columns={OrderColumns}
          data={orders}
          pageCount={pageCount}
          totalCount={totalCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          pageSize={PAGE_SIZE}
          bulkActions={bulkActions}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col ">
      <DataTable
        columns={OrderColumns}
        data={orders}
        pageCount={pageCount}
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={PAGE_SIZE}
        isLoading={showLoader}
        bulkActions={bulkActions}
      />
    </div>
  );
};

export default OrdersTableShell;
