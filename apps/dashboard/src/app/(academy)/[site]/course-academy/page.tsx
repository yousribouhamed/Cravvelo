import CoursesGrid from "../../_components/course-component/courses-grid";
import FilterCourses from "../../_components/course-component/filter-courses";
import MaxWidthWrapper from "../../_components/max-width-wrapper";
import ThemeFooterProduction from "../../builder-components/theme-footer-production";
import ThemeHeaderProduction from "../../builder-components/theme-header-production";

export const fetchCache = "force-no-store";

interface pageAbdullahProps {
  params: { site: string };
}

const Page = async ({ params }: pageAbdullahProps) => {
  // fetch the data in here then pass it to the children
  return (
    <>
      <ThemeHeaderProduction />
      <MaxWidthWrapper className="mt-[70px] w-full h-fit min-h-screen">
        <h1 className="text-3xl font-bold text-black my-8 text-start">
          الدورات المتاحة
        </h1>
        <div className="  w-full h-fit min-h-screen flex justify-between gap-x-4 items-start py-4">
          <FilterCourses />

          <CoursesGrid />
        </div>
      </MaxWidthWrapper>

      <ThemeFooterProduction />
    </>
  );
};

export default Page;
