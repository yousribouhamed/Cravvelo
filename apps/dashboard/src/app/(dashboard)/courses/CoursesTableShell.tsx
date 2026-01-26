"use client";
import { DataTable } from "@/src/components/data-table/tables";
import { Course } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { useCoursesColumns } from "@/src/modules/course/components/columns/courses";
import { useMounted } from "@/src/hooks/use-mounted";
import DeleteCourseModel from "@/src/components/models/delete-course-modal";
import { Loader } from "@/src/components/loader-icon";
import { useState } from "react";
import { useDebounce } from "@/src/hooks/use-debounce";

interface CoursesTableShellProps {
  initialData: Course[];
}

const CoursesTableShell: FC<CoursesTableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();
  const columns = useCoursesColumns();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [levelFilters, setLevelFilters] = useState<string[]>([]);
  
  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, refetch, isLoading, isFetching } = trpc.course.getAllCourses.useQuery(
    {
      search: debouncedSearch || undefined,
      status: statusFilters.length > 0 ? statusFilters : undefined,
      level: levelFilters.length > 0 ? levelFilters : undefined,
    },
    {
      placeholderData: initialData,
      refetchOnWindowFocus: false,
    }
  );

  if (!isMounted) {
    return (
      <div className="w-full min-h-[300px] h-fit flex flex-col mt-8 items-center justify-center">
        <Loader size={20} />
      </div>
    );
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleStatusFilterChange = (values: string[]) => {
    setStatusFilters(values);
  };

  const handleLevelFilterChange = (values: string[]) => {
    setLevelFilters(values);
  };

  // Show loader only when initially loading and no data exists
  // Don't show during background refetches when data already exists
  const courses = (data ?? []) as Course[];
  const hasData = courses.length > 0 || (initialData && initialData.length > 0);
  const showLoader = isLoading && !hasData;


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
      />
    </div>
  );
};

export default CoursesTableShell;
