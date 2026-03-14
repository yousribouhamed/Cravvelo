"use client";
import { DataTable } from "@/src/components/data-table/tables";
import { Student } from "database";
import type { FC } from "react";
import { useState, useCallback, useMemo } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { useStudentsColumns } from "@/src/components/data-table/columns/students";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-helpers/table-loading";
import { useDebounce } from "@/src/hooks/use-debounce";
import { useTranslations } from "next-intl";

const PAGE_SIZE = 10;

interface StudentsTableShellProps {
  initialData: {
    students: Student[];
    totalCount: number;
    pageCount: number;
    currentPage: number;
  };
}

const StudentsTableShell: FC<StudentsTableShellProps> = ({ initialData }) => {
  const t = useTranslations("students.bulkActions");
  const isMounted = useMounted();
  const columns = useStudentsColumns();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, refetch, isLoading } = trpc.getAllStudents.useQuery(
    {
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
    },
    {
      initialData,
      refetchOnWindowFocus: false,
    }
  );

  const students = data?.students ?? [];
  const totalCount = data?.totalCount ?? 0;
  const pageCount = data?.pageCount ?? 1;
  const currentPage = data?.currentPage ?? 1;
  const hasData =
    (initialData?.students?.length ?? 0) > 0 || students.length > 0;
  const showLoader = isLoading && !hasData;

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleExportSelected = useCallback((selected: (Student & { _count?: { Sales: number; Certificates: number } })[]) => {
    if (selected.length === 0) return;
    const headers = ["Full Name", "Email", "Phone", "Status"];
    const rows = selected.map((s) => [
      s.full_name ?? "",
      s.email ?? "",
      s.phone ?? "",
      s.isActive ? "Active" : "Inactive",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const bulkActions = useMemo(
    () => [
      { label: t("exportSelected"), onClick: handleExportSelected },
    ],
    [t, handleExportSelected]
  );

  if (!isMounted && !hasData) {
    return <DataTableLoading columnCount={6} />;
  }
  if (!isMounted && hasData) {
    return (
      <div className="w-full min-h-[300px] h-fit flex flex-col mt-8">
        <DataTable
          columns={columns}
          data={students}
          showSearch={true}
          searchColumns={["full_name", "email", "phone"]}
          tableType="students"
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
          pageCount={pageCount}
          totalCount={totalCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          pageSize={PAGE_SIZE}
          isLoading={false}
          bulkActions={bulkActions}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col mt-8">
      <DataTable
        columns={columns}
        data={students}
        showSearch={true}
        searchColumns={["full_name", "email", "phone"]}
        tableType="students"
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
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

export default StudentsTableShell;
