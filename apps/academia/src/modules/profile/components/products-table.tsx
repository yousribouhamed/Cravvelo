"use client";

import { DataTable } from "@/modules/profile/components/data-table";
import {
  ProductSale,
  useProductColumns,
} from "@/modules/profile/components/columns/products";

export default function ProductsTable({ data }: { data: ProductSale[] }) {
  const columns = useProductColumns();
  return <DataTable columns={columns} data={data} />;
}
