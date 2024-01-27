"use client";
import { DataTable } from "@/src/components/data-table/products-table";
import { Product } from "database";
import type { FC } from "react";
import { trpc } from "../../_trpc/client";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-loading";
import { ProctsColumns } from "@/src/components/data-table/columns/products";

interface ProductsTableShellProps {
  initialData: Product[];
}

const ProductsTableShell: FC<ProductsTableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();

  const { data } = trpc.getProducts.useQuery(undefined, {
    initialData: initialData,
  });

  if (!isMounted) {
    return <DataTableLoading columnCount={6} />;
  }

  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col ">
      <DataTable columns={ProctsColumns} data={data} />
    </div>
  );
};

export default ProductsTableShell;
