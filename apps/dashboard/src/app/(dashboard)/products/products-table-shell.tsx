"use client";
import { DataTable } from "@/src/components/data-table/tables";
import { Product } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { useProductsColumns } from "@/src/components/data-table/columns/products";
import { useMounted } from "@/src/hooks/use-mounted";
import DeleteProductModel from "@/src/components/models/delete-product-modal";
import { Loader } from "@/src/components/loader-icon";
import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "@/src/hooks/use-debounce";
import { useTranslations } from "next-intl";
import { maketoast } from "@/src/components/toasts";

const PAGE_SIZE = 10;

interface ProductsTableShellProps {
  initialData: {
    products: Product[];
    totalCount: number;
    pageCount: number;
    currentPage: number;
  };
}

const ProductsTableShell: FC<ProductsTableShellProps> = ({ initialData }) => {
  const t = useTranslations("products.bulkActions");
  const isMounted = useMounted();
  const columns = useProductsColumns();
  const deleteProductMutation = trpc.deleteProduct.useMutation({
    onSuccess: () => {
      maketoast.success();
      void refetch();
    },
    onError: () => maketoast.error(),
  });

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, refetch, isLoading } = trpc.products.getProducts.useQuery(
    {
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      status: statusFilters.length > 0 ? statusFilters : undefined,
    },
    {
      initialData,
      refetchOnWindowFocus: false,
    }
  );

  const products = (data?.products ?? []) as Product[];
  const totalCount = data?.totalCount ?? 0;
  const pageCount = data?.pageCount ?? 1;
  const currentPage = data?.currentPage ?? 1;
  const hasData = products.length > 0 || (initialData?.products?.length ?? 0) > 0;
  const showLoader = isLoading && !hasData;

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((values: string[]) => {
    setStatusFilters(values);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleDeleteSelected = useCallback(
    (selected: Product[]) => {
      if (selected.length === 0) return;
      selected.forEach((p) => deleteProductMutation.mutate({ productId: p.id }));
    },
    [deleteProductMutation]
  );

  const bulkActions = useMemo(
    () => [
      {
        label: t("deleteSelected"),
        onClick: handleDeleteSelected,
        variant: "destructive" as const,
        disabled: deleteProductMutation.isPending,
      },
    ],
    [t, handleDeleteSelected, deleteProductMutation.isPending]
  );

  if (!isMounted && !hasData) {
    return (
      <div className="w-full min-h-[300px] h-fit flex flex-col mt-8 items-center justify-center">
        <Loader size={20} />
      </div>
    );
  }
  if (!isMounted && hasData) {
    return (
      <div className="w-full min-h-[300px] h-fit flex flex-col mt-8">
        <DeleteProductModel refetch={refetch} />
        <DataTable
          columns={columns}
          data={products}
          showSearch={true}
          searchColumns={["title"]}
          tableType="products"
          onSearchChange={handleSearchChange}
          onStatusFilterChange={handleStatusFilterChange}
          serverSideFiltering={true}
          isLoading={false}
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
    <div className="w-full min-h-[300px] h-fit flex flex-col mt-8">
      <DeleteProductModel refetch={refetch} />
      <DataTable
        columns={columns}
        data={products}
        showSearch={true}
        searchColumns={["title"]}
        tableType="products"
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        serverSideFiltering={true}
        isLoading={showLoader}
        pageCount={pageCount}
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={PAGE_SIZE}
        bulkActions={bulkActions}
      />
    </div>
  );
};

export default ProductsTableShell;
