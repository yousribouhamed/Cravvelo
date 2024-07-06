"use client";
import { DataTable } from "@/src/components/data-table/courses-table";
import { Course } from "database";
import type { FC } from "react";
import { trpc } from "../../_trpc/client";
import { columns } from "@/src/components/data-table/columns/courses";
import { useMounted } from "@/src/hooks/use-mounted";
import { DataTableLoading } from "@/src/components/data-table/table-loading";
import DeleteCourseModel from "@/src/components/models/delete-course-modal";
import PlanExceededPopup from "@/src/components/models/pyment-plan-exceeded";

interface CoursesTableShellProps {
  initialData: Course[];
  academia_url: string;
}

const CoursesTableShell: FC<CoursesTableShellProps> = ({
  initialData,
  academia_url,
}) => {
  const isMounted = useMounted();

  const { data, refetch } = trpc.getAllCourses.useQuery(undefined, {
    initialData: initialData,
  });

  if (!isMounted) {
    return <DataTableLoading columnCount={6} />;
  }

  return (
    <div className="w-full min-h-[300px] h-fit flex flex-col ">
      <DeleteCourseModel refetch={refetch} />

      <DataTable
        columns={columns}
        data={data}
        academia_url={academia_url}
        filterableColumns={[
          {
            id: "status",
            title: "الحالة",
            options: [
              {
                label: "مسودة",

                value: "DRAFT",
              },
              {
                label: "متاح للجميع",

                value: "PUBLISED",
              },
              {
                label: "الوصول المبكر",

                value: "EARLY_ACCESS",
              },
            ],
          },
          {
            id: "level",
            title: "المستوى",
            options: [
              {
                label: "مبتدئ",

                value: "DRAFT",
              },
              {
                label: "متوسط",

                value: "PUBLISED",
              },
              {
                label: "محترف",

                value: "EARLY_ACCESS",
              },
              {
                label: "كل المستويات",

                value: "EARLY_ACCESS",
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default CoursesTableShell;
