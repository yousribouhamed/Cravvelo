"use client";
import { DataTable } from "@/src/components/data-table/tables";
import { Course } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { useCoursesColumns } from "@/src/modules/course/components/columns/courses";
import { useMounted } from "@/src/hooks/use-mounted";
import DeleteCourseModel from "@/src/components/models/delete-course-modal";
import { Loader } from "@/src/components/loader-icon";
import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "@/src/hooks/use-debounce";
import { useTranslations } from "next-intl";
import { deleteCourseAction } from "@/src/actions/courses.actions";
import { maketoast } from "@/src/components/toasts";

const PAGE_SIZE = 10;

interface CoursesTableShellProps {
  initialData: {
    courses: Course[];
    totalCount: number;
    pageCount: number;
    currentPage: number;
  };
}

const CoursesTableShell: FC<CoursesTableShellProps> = ({ initialData }) => {
  const t = useTranslations("courses.bulkActions");
  const isMounted = useMounted();
  const columns = useCoursesColumns();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [levelFilters, setLevelFilters] = useState<string[]>([]);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, refetch, isLoading } = trpc.course.getAllCourses.useQuery(
    {
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      status: statusFilters.length > 0 ? statusFilters : undefined,
      level: levelFilters.length > 0 ? levelFilters : undefined,
    },
    {
      initialData,
      refetchOnWindowFocus: false,
    }
  );

  const courses = (data?.courses ?? []) as Course[];
  const totalCount = data?.totalCount ?? 0;
  const pageCount = data?.pageCount ?? 1;
  const currentPage = data?.currentPage ?? 1;
  const hasData = courses.length > 0 || (initialData?.courses?.length ?? 0) > 0;
  const showLoader = isLoading && !hasData;

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((values: string[]) => {
    setStatusFilters(values);
    setPage(1);
  }, []);

  const handleLevelFilterChange = useCallback((values: string[]) => {
    setLevelFilters(values);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleDeleteSelected = useCallback(
    async (selected: Course[]) => {
      if (selected.length === 0) return;
      try {
        await Promise.all(
          selected.map((c) =>
            deleteCourseAction({
              courseId: c.id,
              imageurl: c.thumbnailUrl ?? null,
            })
          )
        );
        maketoast.success();
        await refetch();
      } catch {
        maketoast.error();
      }
    },
    [refetch]
  );

  const bulkActions = useMemo(
    () => [{ label: t("deleteSelected"), onClick: handleDeleteSelected, variant: "destructive" as const }],
    [t, handleDeleteSelected]
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
        <DeleteCourseModel refetch={refetch} />
        <DataTable
          columns={columns}
          data={courses}
          showSearch={true}
          searchColumns={["title"]}
          tableType="courses"
          onSearchChange={handleSearchChange}
          onStatusFilterChange={handleStatusFilterChange}
          onLevelFilterChange={handleLevelFilterChange}
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
      <DeleteCourseModel refetch={refetch} />
      <DataTable
        columns={columns}
        data={courses}
        showSearch={true}
        searchColumns={["title"]}
        tableType="courses"
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onLevelFilterChange={handleLevelFilterChange}
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

export default CoursesTableShell;
