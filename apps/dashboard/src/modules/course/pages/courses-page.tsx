import { Course } from "database";
import CoursesTableShell from "@/src/app/(dashboard)/courses/CoursesTableShell";

interface CoursesPageProps {
  initialData: {
    courses: Course[];
    totalCount: number;
    pageCount: number;
    currentPage: number;
  };
}

export default function CoursesPage({ initialData }: CoursesPageProps) {
  return (
    <div className="my-8 flex flex-col gap-y-4">
      <CoursesTableShell initialData={initialData} />
    </div>
  );
}
