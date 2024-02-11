import { Club, Info, Layers } from "lucide-react";
import MaxWidthWrapper from "../../../_components/max-width-wrapper";
import ThemeFooterProduction from "../../../builder-components/theme-footer-production";
import ThemeHeaderProduction from "../../../builder-components/theme-header-production";
import CourseContent from "../../../_components/course-component/course-content";
import Feedbacks from "../../../_components/course-component/feedbacks";
import StarRatings from "react-star-ratings";
import { Hourglass } from "lucide-react";
import { Zap } from "lucide-react";
import { ShoppingCart } from "lucide-react";

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
        <div className="  w-full h-fit min-h-screen flex flex-col lg:flex-row  justify-between gap-x-4 items-start py-4">
          <div className=" w-full lg:w-[calc(100%-300px)] min-h-[500px] h-fit px-2 py-8 lg:p-8">
            {/* video placeholder */}
            <div className="w-full h-[400px] bg-gray-500 rounded-xl"></div>
            {/* description */}
            <div className="w-full h-[400px] flex flex-col rounded-xl">
              <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
                <div className="w-[45px] h-[45px] rounded-[50%] bg-black flex items-center justify-center">
                  <Info className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">وصف الوردة</h3>
              </div>
              <div className="w-full h-[200px] ">
                <p>
                  بالتأكيد هناك أيضاً الكثير من المنصات التي لم أذكرها أيضاً
                  والتي يمكننا التكلم عنها لاحقاً، ولكن الشيء الذي أردت الإشارة
                  إليه ضمن هذه المقالة، بأن الكثير من المشاريع في الوقت الحالي
                  يمكنها الاستفادة من هذه الأدوات إما بشكل دائم أو بشكل جزئي.
                  لذلك إن كنت تخطط لإطلاق مشروع تقني جديد أنصحك بشدة أن تبدأ
                  بإحدى هذه الأدوات من أجل التأكد من فكرتك في البداية، وذلك من
                  أجل أن توفر الكثير من المال والجهد والمال الذي سوف تنفقه على
                  فكرة قد تكون غير ناجحة.
                </p>
              </div>
            </div>
            {/* what you are gonna learn */}
            <div className="w-full h-[400px] flex flex-col rounded-xl">
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
            <div className="w-full h-[400px] flex flex-col rounded-xl">
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
            <CourseContent />
            <Feedbacks />
          </div>
          <Product_card />
        </div>
      </MaxWidthWrapper>
      <ThemeFooterProduction />
    </>
  );
};

export default Page;

const Product_card = () => {
  return (
    <div className=" w-full lg:w-[350px] h-[500px] rounded-xl border my-8 p-4 flex flex-col gap-y-4 sticky top-0">
      <h1 className="text-xl font-bold text-start ">
        الدليل الشامل لاستخدام مواقع الويب
      </h1>
      <p className="text-gray-500 text-sm  ">
        حتى تكون الأمور سهلة قمت بتقسيم الدورات لمسارين منفصلين كل مسار يحتوي
        على الدورات التي تحتاج الالتحاق بها لتعلم هذا التخصص.
      </p>
      <div className="w-full h-[30px] flex items-center justify-start gap-x-4 ">
        <p className="text-green-500 text-lg font-bold  ">199 دينار جزائري</p>
        <p className="text-gray-800 line-through text-xs ">300 دينار جزائري</p>
      </div>
      <div className="w-full h-[40px] flex items-center justify-between gap-x-4">
        <button className=" w-full  lg:w-[300px] h-[40px]  rounded-xl bg-blue-500 flex items-center justify-center text-white">
          اشتري الان
        </button>
        <button className="w-[50px] h-[40px] rounded-xl bg-gray-100 flex items-center justify-center">
          <ShoppingCart className="w-4 h-4 text-gray-700" />
        </button>
      </div>
      <div className="w-[99%] h-1 border-b  mx-4" />

      <div className="w-full min-h-[40px] h-fit flex flex-col  items-start justify-center gap-y-3">
        {/* <StarRatings rating={2.403} starDimension="20px" starSpacing="1px" /> */}
        <span>(تقيم 2)</span>
        <p className="text-start text-gray-700 text-sm">تشمل هذه الدورة على</p>

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
  );
};
