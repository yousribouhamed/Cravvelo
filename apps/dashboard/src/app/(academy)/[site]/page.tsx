import { notFound } from "next/navigation";
import { getAllCourses, getSiteData } from "../_actions";
import CoursesReel from "../_components/courses-reel";
import { getSubDomainValue } from "../lib";
import AcademyHeader from "../_components/layout/academy-header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { getStudent } from "../_actions/auth";
import AcademiaFooter from "../_components/layout/academy-footer";
import Banner from "../_components/banner";
import Suspanded from "../_components/suspanded";

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
        color={website?.color}
        student={student}
        isAuthanticated={student ? true : false}
        subdomain={website?.subdomain ?? null}
        logo={website?.logo}
      />
      <MaxWidthWrapper className="h-fit mt-[110px] min-h-[calc(100vh-70px)] ">
        <main className="w-full h-fit min-h-full flex flex-col items-center justify-center  p-4 sm:p-0s">
          <Banner />
          <CoursesReel color={website?.color} courses={courses} />
        </main>
      </MaxWidthWrapper>
      <AcademiaFooter />
    </>
  );
};

export default Page;
