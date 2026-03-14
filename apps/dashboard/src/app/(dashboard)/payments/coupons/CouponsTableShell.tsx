"use client";

import { Coupon } from "database";
import { useState, useCallback, useMemo } from "react";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { useCouponColumns } from "@/src/components/data-table/columns/cobons";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-helpers/table-loading";
import { CouponDataTable } from "@/src/components/data-table/tables/coupon-table";
import { useDebounce } from "@/src/hooks/use-debounce";
import { CouponSheet } from "@/src/modules/payments/components/coupon-sheet";
import { useTranslations } from "next-intl";
import { maketoast } from "@/src/components/toasts";

interface CouponTableShellProps {
  initialData: {
    coupons: Coupon[];
    totalCount: number;
    pageCount: number;
    currentPage: number;
  };
}

const CouponsTableShell: FC<CouponTableShellProps> = ({ initialData }) => {
  const t = useTranslations("coupons.bulkActions");
  const isMounted = useMounted();
  const utils = trpc.useUtils();
  const toggleMutation = trpc.toggleCouponStatus.useMutation({
    onSuccess: () => {
      maketoast.success();
      void utils.getAllCoupons.invalidate();
    },
    onError: () => maketoast.error(),
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<
    ("active" | "inactive" | "archived")[]
  >([]);
  const [discountTypeFilters, setDiscountTypeFilters] = useState<
    ("PERCENTAGE" | "FIXED_AMOUNT")[]
  >([]);

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, refetch, isLoading, isFetching } = trpc.getAllCoupons.useQuery(
    {
      page,
      limit: pageSize,
      search: debouncedSearch || undefined,
      status: statusFilters.length > 0 ? statusFilters : undefined,
      discountType: discountTypeFilters.length > 0 ? discountTypeFilters : undefined,
    },
    {
      placeholderData: initialData,
      refetchOnWindowFocus: false,
    }
  );

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page when searching
  }, []);

  const handleStatusFilterChange = useCallback((values: string[]) => {
    setStatusFilters(values as ("active" | "inactive" | "archived")[]);
    setPage(1);
  }, []);

  const handleDiscountTypeFilterChange = useCallback((values: string[]) => {
    setDiscountTypeFilters(values as ("PERCENTAGE" | "FIXED_AMOUNT")[]);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleCreateCoupon = useCallback(() => {
    setEditingCoupon(null);
    setSheetOpen(true);
  }, []);

  const handleEditCoupon = useCallback((coupon: Coupon) => {
    setEditingCoupon(coupon);
    setSheetOpen(true);
  }, []);

  const handleSheetSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleDeactivateSelected = useCallback(
    (selected: Coupon[]) => {
      const activeCoupons = selected.filter((c) => c.isActive);
      if (activeCoupons.length === 0) return;
      activeCoupons.forEach((c) => toggleMutation.mutate({ id: c.id }));
    },
    [toggleMutation]
  );

  const bulkActions = useMemo(
    () => [
      {
        label: t("deactivateSelected"),
        onClick: handleDeactivateSelected,
        disabled: toggleMutation.isPending,
      },
    ],
    [t, handleDeactivateSelected, toggleMutation.isPending]
  );

  // Get columns with edit handler
  const columns = useCouponColumns({ onEdit: handleEditCoupon });

  const coupons = data?.coupons ?? [];
  const totalCount = data?.totalCount ?? 0;
  const pageCount = data?.pageCount ?? 1;
  const hasData =
    (initialData?.coupons?.length ?? 0) > 0 || coupons.length > 0;
  const showLoader = isLoading && !hasData;

  if (!isMounted && !hasData) {
    return <DataTableLoading columnCount={7} />;
  }
  if (!isMounted && hasData) {
    return (
      <div className="w-full min-h-[300px] h-fit flex flex-col">
        <CouponDataTable
          columns={columns}
          data={coupons}
          refetch={refetch}
          pageCount={pageCount}
          totalCount={totalCount}
          currentPage={page}
          onPageChange={handlePageChange}
          onSearchChange={handleSearchChange}
          onStatusFilterChange={handleStatusFilterChange}
          onDiscountTypeFilterChange={handleDiscountTypeFilterChange}
          onCreateCoupon={handleCreateCoupon}
          isLoading={false}
          serverSideFiltering={true}
          bulkActions={bulkActions}
        />
        <CouponSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          coupon={editingCoupon}
          onSuccess={handleSheetSuccess}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col">
      <CouponDataTable
        columns={columns}
        data={coupons}
        refetch={refetch}
        pageCount={pageCount}
        totalCount={totalCount}
        currentPage={page}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onDiscountTypeFilterChange={handleDiscountTypeFilterChange}
        onCreateCoupon={handleCreateCoupon}
        isLoading={showLoader}
        serverSideFiltering={true}
        bulkActions={bulkActions}
      />
      
      <CouponSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        coupon={editingCoupon}
        onSuccess={handleSheetSuccess}
      />
    </div>
  );
};

export default CouponsTableShell;
