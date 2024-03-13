import { getCourseByUrlPath } from "../../../_actions/course";
import { get_course_chapters } from "../../../_actions/chapter";
import CourseDisplayContent from "./course-content";
import { Product_card } from "./product-card";
import { getSubDomainValue } from "../../../lib";
import { getSiteData } from "../../../_actions";
import { notFound } from "next/navigation";
import AcademyHeader from "../../../_components/layout/academy-header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { getStudent } from "../../../_actions/auth";
import Raitings from "../../../_components/raitings";

interface PageProps {
  params: { site: string; url: string };
}

const Page = async ({ params }: PageProps) => {
  const subdomain = getSubDomainValue({ value: params.site });

  const [student, website, course] = await Promise.all([
    getStudent(),
    getSiteData({
      subdomain,
    }),
    getCourseByUrlPath({ url: params?.url }),
  ]);

  const chapters = await get_course_chapters({ courseID: course?.id });

  if (!website) {
    notFound();
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
      <MaxWidthWrapper className="h-fit mt-[70px] min-h-[calc(100vh-70px)] ">
        <div className="  w-full h-fit min-h-screen flex flex-col lg:flex-row  justify-between gap-x-4 items-start py-4">
          <div className=" w-full lg:w-[calc(100%-300px)] min-h-[500px] h-fit px-2 py-8 lg:p-8">
            <h1 className="text-3xl font-bold text-black text-start">
              {course.title}
            </h1>

            <div className="w-full h-[100px] bg-gray-100 rounded-xl flex flex-wrap gap-x-4 my-8 p-4">
              <span className="text-lg font-bold">
                95% تقييمات إيجابية (80)
              </span>
              <span className="text-lg font-bold">5288 طالبا</span>
              <span className="text-lg font-bold">الصوت: عربي</span>
            </div>
            <CourseDisplayContent course={course} chapters={chapters} />
            <Raitings />
          </div>
          <Product_card color={website?.color} course={course} />
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default Page;
