import { Course } from "database";
import { CoursesColumns } from "../components/columns/courses";
import { DataTable } from "@/src/components/data-table";

interface CoursesPageProps {
  courses: Course[];
}

export default function CoursesPage({ courses }: CoursesPageProps) {
  return (
    <div>
      <div className="w-full h-[40px] bg-red-500"></div>
      <DataTable columns={CoursesColumns} data={courses ?? []} />
    </div>
  );
}
