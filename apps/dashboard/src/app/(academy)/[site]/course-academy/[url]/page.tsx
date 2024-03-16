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
import { ArrowBigUp, Headphones, Star } from "lucide-react";
import { User } from "lucide-react";
import { Clock } from "lucide-react";
import { Globe } from "lucide-react";
import { GraduationCap } from "lucide-react";
import { Infinity } from "lucide-react";
import { get_course_rating } from "../../../_actions/rating";

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
  const comments = await get_course_rating({ courseId: course.id });

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
      <MaxWidthWrapper className="h-fit mt-[70px] min-h-[calc(100vh-70px)] overflow-hidden ">
        <div className="  w-full h-fit min-h-screen flex flex-col lg:flex-row  justify-between gap-x-4 items-start py-4">
          <div className=" w-full lg:w-[calc(100%-300px)] min-h-[500px] h-fit px-2 py-8 lg:p-8">
            <h1 className="text-3xl font-bold text-black text-start">
              {course.title}
            </h1>

            <div className="w-full h-[150px] bg-gray-100 rounded-xl flex flex-wrap gap-4 my-8 p-4">
              <div className="w-fit flex items-center justify-start gap-x-4">
                <Star className="w-5 h-5 " />
                <span>95% تقييمات إيجابية (80)</span>
              </div>

              <div className="w-fit flex items-center justify-start gap-x-4">
                <User className="w-5 h-5 " />
                <span>{course.studenstNbr} طالبا</span>
              </div>

              <div className="w-fit flex items-center justify-start gap-x-4">
                <Clock className="w-5 h-5 " />
                <span>{course.nbrChapters} درسًا (ساعة و56 دقيقة)</span>
              </div>

              <div className="w-fit flex items-center justify-start gap-x-4">
                <Globe className="w-5 h-5 " />
                <span>عبر الإنترنت وبالسرعة التي تناسبك</span>
              </div>
              <div className="w-fit flex items-center justify-start gap-x-4">
                <Headphones className="w-5 h-5 " />
                <span>الصوت: عربي</span>
              </div>

              <div className="w-fit flex items-center justify-start gap-x-4">
                <ArrowBigUp className="w-5 h-5 " />
                <span>المستوى: مبتدئ</span>
              </div>

              <div className="w-fit flex items-center justify-start gap-x-4">
                <Infinity className="w-5 h-5 " />
                <span>وصول غير محدود إلى الأبد</span>
              </div>

              <div className="w-fit flex items-center justify-start gap-x-4">
                <GraduationCap className="w-5 h-5 " />
                <span>ستحصل على شهادة بعد اتمام الدورة</span>
              </div>
            </div>
            <CourseDisplayContent course={course} chapters={chapters} />
            <Raitings course={course} comments={comments} />
          </div>
          <Product_card
            comments={comments}
            color={website?.color}
            course={course}
          />
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default Page;
