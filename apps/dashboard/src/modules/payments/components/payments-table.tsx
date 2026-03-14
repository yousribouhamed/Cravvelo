"use client";

import { useState, useCallback } from "react";
import { DataTable } from "@/src/components/data-table/tables";
import { usePaymentColumns } from "../components/columns/payments";
import type { Payment } from "../components/columns/payments";
const PAGE_SIZE = 10;

type FetchPageFn = (input?: { page?: number; limit?: number }) => Promise<{
  data: Payment[] | null;
  totalCount?: number;
  pageCount?: number;
  currentPage?: number;
}>;

interface PaymentsTableProps {
  initialData: {
    data: Payment[];
    totalCount: number;
    pageCount: number;
    currentPage: number;
  };
  fetchPage: FetchPageFn;
}

export function PaymentsTable({ initialData, fetchPage }: PaymentsTableProps) {
  const columns = usePaymentColumns();
  const [page, setPage] = useState(initialData.currentPage);
  const [data, setData] = useState(initialData.data);
  const [totalCount, setTotalCount] = useState(initialData.totalCount);
  const [pageCount, setPageCount] = useState(initialData.pageCount);
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = useCallback(
    async (newPage: number) => {
      if (newPage === currentPage) return;
      setIsLoading(true);
      try {
        const result = await fetchPage({ page: newPage, limit: PAGE_SIZE });
        if (result.data) {
          setData(result.data);
          setTotalCount(result.totalCount ?? 0);
          setPageCount(result.pageCount ?? 1);
          setCurrentPage(result.currentPage ?? newPage);
          setPage(newPage);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, fetchPage]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      totalCount={totalCount}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      pageSize={PAGE_SIZE}
      isLoading={isLoading}
    />
  );
}
