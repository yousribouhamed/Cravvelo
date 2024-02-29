import { Filter, Search } from "lucide-react";
import CoursesGrid from "../../_components/course-component/courses-grid";
import { Input } from "@ui/components/ui/input";
import FilterCourses from "../../_components/course-component/filter-courses";
import { getAllCourses } from "../../_actions";
export const fetchCache = "force-no-store";

interface PageProps {
  params: { site: string };
}

const Page = async ({ params }: PageProps) => {
  const subdomain_value =
    process.env.NODE_ENV === "development"
      ? "abdullah.jadir.vercel.app"
      : decodeURIComponent(params?.site);

  const courses = await getAllCourses({ subdomain: subdomain_value });
  return (
    <div className="  w-full h-fit min-h-screen flex flex-col gap-4 items-start py-4">
      {/* <FilterCourses /> */}
      <div className="w-full h-[100px] flex items-center justify-start">
        <h1 className="text-3xl font-bold">الدورات التدربية</h1>
      </div>

      <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
        <FilterCourses />
        <div className="w-fit h-fit flex items-center justify-start gap-x-2">
          <button className="bg-primary  text-white hover:bg-orange-700 rounded-xl border p-4">
            <Search className=" w-4 h-4" />
          </button>
          <Input className="p-4 rounded-xl w-[200px]" />
        </div>
      </div>

      <CoursesGrid courses={courses} />
    </div>
  );
};

export default Page;
