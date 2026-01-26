import { Course } from "database";
import CoursesTableShell from "@/src/app/(dashboard)/courses/CoursesTableShell";

interface CoursesPageProps {
  courses: Course[];
}

export default function CoursesPage({ courses }: CoursesPageProps) {
  return (
    <div className="my-8 flex flex-col gap-y-4">
      <CoursesTableShell initialData={courses ?? []} />
    </div>
  );
}
