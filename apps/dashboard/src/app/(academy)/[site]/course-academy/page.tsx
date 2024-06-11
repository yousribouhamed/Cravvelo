import CoursesGrid from "../../_components/course-component/courses-grid";
import { getAllCourses, getSiteData } from "../../_actions";
import { getSubDomainValue } from "../../lib";
import { notFound } from "next/navigation";
import AcademyHeader from "../../_components/layout/academy-header";
import MaxWidthWrapper from "../../_components/max-width-wrapper";
import { getStudent } from "../../_actions/auth";
import AcademiaFooter from "../../_components/layout/academy-footer";
import Suspanded from "../../_components/suspanded";
import FilterButtonMobile from "../../_components/filter-button";
export const fetchCache = "force-no-store";

interface PageProps {
  params: { site: string };
}

const Page = async ({ params }: PageProps) => {
  const subdomain = getSubDomainValue({ value: params.site });

  const [student, website, courses] = await Promise.all([
    getStudent(),
    getSiteData({
      subdomain,
    }),
    getAllCourses({ subdomain }),
  ]);

  if (!website) {
    notFound();
  }
  if (website.suspended) {
    return <Suspanded />;
  }

  return (
    <>
      <AcademyHeader
        referralEnabled={website.enableReferral}
        color={website?.color}
        student={student}
        isAuthanticated={student ? true : false}
        subdomain={website?.subdomain ?? null}
        logo={website?.logo}
      />
      <MaxWidthWrapper className="h-fit mt-[110px] min-h-[calc(100vh-70px)] ">
        <div className="  w-full h-fit min-h-screen flex flex-col gap-4 items-start py-4">
          <div className="w-full h-[100px] flex items-center justify-between">
            <h1 className="text-3xl font-bold">الدورات التدربية</h1>
            <div className="md:hidden">
              <FilterButtonMobile color={website?.color} />
            </div>
          </div>
          <CoursesGrid courses={courses} color={website?.color} />
        </div>
      </MaxWidthWrapper>
      <AcademiaFooter />
    </>
  );
};

export default Page;
