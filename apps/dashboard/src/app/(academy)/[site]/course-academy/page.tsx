import CoursesGrid from "../../_components/course-component/courses-grid";
import FilterCourses from "../../_components/course-component/filter-courses";
export const fetchCache = "force-no-store";

interface PageProps {
  params: { site: string };
}

const Page = async ({ params }: PageProps) => {
  // fetch the data in here then pass it to the children
  return (
    <div className="  w-full h-fit min-h-screen flex justify-between gap-4 items-start py-4">
      <FilterCourses />

      <CoursesGrid />
    </div>
  );
};

export default Page;
