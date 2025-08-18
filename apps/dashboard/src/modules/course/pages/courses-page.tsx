import { Course } from "database";
import { CoursesColumns } from "../components/columns/courses";
import { DataTable } from "@/src/components/data-table";
import AddCourse from "@/src/components/models/create-course-modal";

interface CoursesPageProps {
  courses: Course[];
}

export default function CoursesPage({ courses }: CoursesPageProps) {
  console.log("here is a course");
  console.log(courses);
  return (
    <div className="my-8 flex flex-col gap-y-4">
      <div className="w-full h-[40px] flex items-center justify-end">
        <AddCourse />
      </div>
      <DataTable columns={CoursesColumns} data={courses ?? []} />
    </div>
  );
}
