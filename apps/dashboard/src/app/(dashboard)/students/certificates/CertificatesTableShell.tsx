"use client";

import { Certificate } from "database";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { useCertificateColumns } from "@/src/components/data-table/columns/certificate";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-helpers/table-loading";
import { CertificateDataTable } from "@/src/components/data-table/tables/certificate-table";
import DeleteCertificateModel from "@/src/components/models/delete-certificate.modal";
import { useTranslations } from "next-intl";
import { maketoast } from "@/src/components/toasts";

interface TableShellProps {
  initialData: Certificate[];
}

const CertificateTableShell: FC<TableShellProps> = ({ initialData }) => {
  const t = useTranslations("certificates.bulkActions");
  const isMounted = useMounted();
  const columns = useCertificateColumns();
  const utils = trpc.useUtils();
  const updateStatusMutation = trpc.updateCertificateStatus.useMutation({
    onSuccess: () => {
      maketoast.success();
      void utils.getAllCertificates.invalidate();
    },
    onError: () => maketoast.error(),
  });

  const { data, refetch } = trpc.getAllCertificates.useQuery(undefined, {
    initialData: initialData,
  });

  const hasData =
    (initialData?.length ?? 0) > 0 || (data?.length ?? 0) > 0;

  const handleRevokeSelected = useCallback(
    (selected: Certificate[]) => {
      const toRevoke = selected.filter((c) => c.status !== "REVOKED");
      if (toRevoke.length === 0) return;
      toRevoke.forEach((c) =>
        updateStatusMutation.mutate({ id: c.id, status: "REVOKED" })
      );
    },
    [updateStatusMutation]
  );

  const bulkActions = useMemo(
    () => [
      {
        label: t("revokeSelected"),
        onClick: handleRevokeSelected,
        variant: "destructive" as const,
        disabled: updateStatusMutation.isPending,
      },
    ],
    [t, handleRevokeSelected, updateStatusMutation.isPending]
  );

  if (!isMounted && !hasData) {
    return <DataTableLoading columnCount={6} />;
  }
  if (!isMounted && hasData) {
    return (
      <div className="w-full min-h-[300px] my-4 h-fit flex flex-col min-w-0">
        <DeleteCertificateModel refetch={refetch} />
        <CertificateDataTable
          columns={columns}
          data={data ?? initialData ?? []}
          refetch={refetch}
          bulkActions={bulkActions}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[300px] my-4 h-fit flex flex-col min-w-0">
      <DeleteCertificateModel refetch={refetch} />
      <CertificateDataTable
        columns={columns}
        data={data ?? []}
        refetch={refetch}
        bulkActions={bulkActions}
      />
    </div>
  );
};

export default CertificateTableShell;
