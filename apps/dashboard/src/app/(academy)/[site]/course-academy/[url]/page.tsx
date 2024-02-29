import { Club, Info, Layers } from "lucide-react";
import CourseContent from "../../../_components/course-component/course-content";
import Feedbacks from "../../../_components/course-component/feedbacks";
import { Hourglass } from "lucide-react";
import { Zap } from "lucide-react";
import { getCourseByUrlPath } from "../../../_actions/course";
import CourseDescription from "../../../_components/course-component/course-description";
import { Course } from "database";
import { get_course_chapters } from "../../../_actions/chapter";
import YoutubeVideoPlayer from "../../../_components/course-component/youtube-video-player";

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
          {/* video placeholder */}
          {course.thumnailUrl && (
            <div className="w-full h-[600px] rounded-xl">
              <YoutubeVideoPlayer url={course.youtubeUrl} />
            </div>
          )}
          {/* description */}
          <CourseDescription
            // @ts-ignore
            value={JSON.parse(course.courseDescription as string)}
          />
          {/* what you are gonna learn */}
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
          {/* requirements */}
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
      </div>
    </>
  );
};

export default Page;

const Product_card = ({ course }: { course: Course }) => {
  return (
    <div className=" w-full lg:w-[350px] min-h-[500px] h-fit rounded-xl border my-8 flex flex-col gap-y-4 lg:sticky lg:top-[100px] bg-white">
      <img
        src={course.thumnailUrl}
        className="w-full h-[200px] rounded-t-xl object-cover "
      />
      <div className="w-full p-4 pt-0 h-fit">
        <h1 className="text-xl font-bold text-start ">{course.title}</h1>
        <p className="text-gray-500 text-sm  ">{course.courseResume}</p>
        <div className="w-full h-[40px] my-2 flex items-center justify-start gap-x-4 ">
          <p className="text-green-500 text-lg font-bold  ">
            {course.price} دينار جزائري
          </p>

          <p className="text-gray-800 line-through text-xs ">
            {course.compareAtPrice} دينار جزائري
          </p>
        </div>
        <div className="w-full h-[40px] flex items-center justify-between gap-x-4">
          <button className=" w-full  lg:w-[300px] h-[40px]  rounded-xl bg-primary flex items-center justify-center text-white">
            اشتري الان
          </button>
        </div>
        <div className="w-[99%] h-1 border-b  mx-4" />

        <div className="w-full min-h-[40px] h-fit flex flex-col my-4  items-start justify-center gap-y-3">
          {/* <StarRatings rating={2.403} starDimension="20px" starSpacing="1px" /> */}
          <span>(تقيم 2)</span>
          <p className="text-start text-gray-700 text-sm">
            تشمل هذه الدورة على
          </p>

          <div className="w-full h-[30px] flex items-center justify-start px-4 gap-x-4">
            <Hourglass className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 font-bold text-sm"> مدة الدورة</span>
          </div>

          <div className="w-full h-[30px] flex items-center justify-start px-4 gap-x-4">
            <Layers className="w-4 h-4 text-gray-500" />

            <span className="text-gray-500 font-bold text-sm">
              {" "}
              المواد التعليمية
            </span>
          </div>

          <div className="w-full h-[30px] flex items-center justify-start px-4 gap-x-4">
            <Zap className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 font-bold text-sm"> المستوى</span>
          </div>

          <div className="w-full h-[30px] flex items-center justify-start px-4 gap-x-4">
            ستحصل على شهادة بعد اتمام الدورة
          </div>
        </div>
      </div>
    </div>
  );
};
