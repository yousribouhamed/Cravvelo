import { getCourseByUrlPath } from "../../../_actions/course";
import { Course } from "database";
import { get_course_chapters } from "../../../_actions/chapter";
import CourseDisplayContent from "./course-content";
import { Product_card } from "./product-card";

interface PageProps {
  params: { site: string; url: string };
}

const Page = async ({ params }: PageProps) => {
  const course = await getCourseByUrlPath({ url: params?.url });

  const chapters = await get_course_chapters({ courseID: course?.id });

  return (
    <>
      <div className="  w-full h-fit min-h-screen flex flex-col lg:flex-row  justify-between gap-x-4 items-start py-4">
        <div className=" w-full lg:w-[calc(100%-300px)] min-h-[500px] h-fit px-2 py-8 lg:p-8">
          <h1 className="text-3xl font-bold text-black text-start">
            {course.title}
          </h1>

          <div className="w-full h-[100px] bg-gray-100 rounded-xl flex flex-wrap gap-x-4 my-8 p-4">
            <span className="text-lg font-bold">95% تقييمات إيجابية (80)</span>
            <span className="text-lg font-bold">5288 طالبا</span>
            <span className="text-lg font-bold">الصوت: عربي</span>
          </div>
          <CourseDisplayContent course={course} chapters={chapters} />
        </div>

        <Product_card course={course} />
      </div>
    </>
  );
};

export default Page;

{
  /* description
          <CourseDescription
            // @ts-ignore
            value={JSON.parse(course.courseDescription as string)}
          />
          {/* what you are gonna learn
          <div className="w-full min-h-[200px] h-fit flex flex-col rounded-xl">
            <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
              <div className="w-[45px] h-[45px] rounded-[50%] bg-black flex items-center justify-center">
                <Club className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">ماذا ستتعلم في هذه الدورة</h3>
            </div>
            <div className="w-full h-[300px] flex flex-col bg-gray-200 gap-y-4 rounded-xl  p-4">
              <div className="w-full h-[300px] flex flex-col bg-gray-200 gap-y-4 rounded-xl  p-4">
                <div className="w-full h-[50px] bg-white flex items-center justify-start rounded-xl p-5 cursor-pointer hover:bg-gray-50 ">
                  <p className="text-gray-700 text-lg text-start ">
                    ستتعلم شيء على الاقل
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* requirements 
          <div className="w-full min-h-[200px] h-fit flex flex-col rounded-xl">
            <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
              <div className="w-[45px] h-[45px] rounded-[50%] bg-black flex items-center justify-center">
                <Info className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">متطلبات حضور الدورة</h3>
            </div>
            <div className="w-full h-[300px] flex flex-col bg-gray-200 gap-y-4 rounded-xl  p-4">
              <div className="w-full h-[50px] bg-white flex items-center justify-start rounded-xl p-5 cursor-pointer hover:bg-gray-50 ">
                <p className="text-gray-700 text-lg text-start ">
                  ستتعلم شيء على الاقل
                </p>
              </div>
            </div>
          </div>
          <CourseContent chapters={chapters} />
          <Feedbacks />
        </div>
        <Product_card course={course} />
      </div> */
}
