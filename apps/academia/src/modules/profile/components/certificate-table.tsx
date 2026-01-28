"use client";

import { DataTable } from "./data-table";
import { CertificateColumns } from "./columns/certificate";

interface CertificateTableProps {
  data: any[];
}

export function CertificateTable({ data }: CertificateTableProps) {
  return <DataTable columns={CertificateColumns()} data={data} />;
}
