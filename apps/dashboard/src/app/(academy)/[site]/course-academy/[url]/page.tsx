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
import { get_course_rating } from "../../../_actions/rating";
import AcademiaFooter from "../../../_components/layout/academy-footer";
import Suspanded from "../../../_components/suspanded";
import { Metadata } from "next";

interface PageProps {
  params: { site: string; url: string };
}

// export async function generateMetadata({
//   params,
// }: {
//   params: { site: string; url: string };
// }): Promise<Metadata | null> {
//   const subdomain = getSubDomainValue({ value: params.site });

//   const [data, course] = await Promise.all([
//     getSiteData({
//       subdomain,
//     }),
//     getCourseByUrlPath({ url: params?.url }),
//   ]);

//   if (!data) {
//     return null;
//   }

//   return {
//     title: `${course.seoTitle ?? course.title} | ${data.name}`,
//     description: `${course.seoDescription} | ${data.name}`,
//     openGraph: {
//       title: `${course.seoTitle ?? course.title} | ${data.name}`,
//       description: `${course.seoDescription ?? course.courseDescription} | ${
//         data.name
//       }`,
//       images: [course.thumbnailUrl],
//     },
//   };
// }

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
  const comments = await get_course_rating({ courseId: course?.id });

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
        displaySalesBanner={website?.enableSalesBanner}
      />

      <MaxWidthWrapper className="h-fit mt-[110px] min-h-[calc(100vh-70px)]  ">
        <div className="  w-full h-fit min-h-screen flex flex-col lg:flex-row  justify-between gap-x-4 items-start py-4">
          <div className=" w-full lg:w-[calc(100%-300px)] min-h-[500px] h-fit px-2 py-8 lg:p-8 pb-4">
            <h1 className="text-3xl font-bold text-black text-start">
              {course.title}
            </h1>

            <CourseDisplayContent
              color={website?.color}
              course={course}
              chapters={chapters}
            />

            {course.allowComment && (
              <Raitings
                isAuthanticated={student ? true : false}
                color={website?.color}
                course={course}
                comments={comments}
              />
            )}
          </div>
          <Product_card
            isSignedIn={student ? true : false}
            subdomain={website.subdomain}
            comments={comments}
            color={website?.color}
            course={course}
          />
        </div>
      </MaxWidthWrapper>
      <AcademiaFooter />
    </>
  );
};

export default Page;
