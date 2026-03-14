"use client";
import { DataTable } from "@/src/components/data-table/tables";
import { Course } from "database";
import type { FC } from "react";
import { trpc } from "@/src/app/_trpc/client";
import { columns } from "@/src/components/data-table/columns/courses";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-helpers/table-loading";
import DeleteCourseModel from "@/src/components/models/delete-course-modal";

interface CoursesTableShellProps {
  initialData: Course[];
}

const CoursesTableShell: FC<CoursesTableShellProps> = ({ initialData }) => {
  const isMounted = useMounted();

  const { data, refetch } = trpc.course.getAllCourses.useQuery(
    { page: 1, limit: 10 },
    {
      placeholderData: Array.isArray(initialData) ? { courses: initialData, totalCount: initialData.length, pageCount: 1, currentPage: 1 } : initialData,
      refetchOnWindowFocus: false,
    }
  );

  const courses = data?.courses ?? (Array.isArray(initialData) ? initialData : initialData?.courses) ?? [];
  const hasData = courses.length > 0;
  if (!isMounted && !hasData) {
    return <DataTableLoading columnCount={6} />;
  }
  if (!isMounted && hasData) {
    return (
      <div className="w-full min-h-[300px] h-fit flex flex-col ">
        <DeleteCourseModel refetch={refetch} />
        <DataTable columns={columns} data={courses} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col ">
      <DeleteCourseModel refetch={refetch} />
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesTableShell;
