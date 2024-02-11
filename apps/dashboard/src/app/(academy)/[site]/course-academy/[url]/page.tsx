import { Club, Info } from "lucide-react";
import MaxWidthWrapper from "../../../_components/max-width-wrapper";
import ThemeFooterProduction from "../../../builder-components/theme-footer-production";
import ThemeHeaderProduction from "../../../builder-components/theme-header-production";
import CourseContent from "../../../_components/course-component/course-content";
import Feedbacks from "../../../_components/course-component/feedbacks";

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
        <div className="  w-full h-fit min-h-screen flex justify-between gap-x-4 items-start py-4">
          <div className="w-[calc(100%-300px)] min-h-[500px] h-fit p-8">
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
                <div className="w-full h-[30px] bg-white flex items-center justify-start rounded-xl p-4 ">
                  <p className="text-black text-xl text-start ">
                    ستتعلم شيء على الاقل
                  </p>
                </div>
                <div className="w-full h-[30px] bg-white flex items-center justify-start rounded-xl p-4 ">
                  <p className="text-black text-xl text-start ">
                    ستتعلم شيء على الاقل
                  </p>
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
                <div className="w-full h-[30px] bg-white flex items-center justify-start rounded-xl p-4 ">
                  <p className="text-black text-xl text-start ">
                    ستتعلم شيء على الاقل
                  </p>
                </div>
                <div className="w-full h-[30px] bg-white flex items-center justify-start rounded-xl p-4 ">
                  <p className="text-black text-xl text-start ">
                    ستتعلم شيء على الاقل
                  </p>
                </div>
              </div>
            </div>
            {/* content */}
            <div className="w-full h-[400px] flex flex-col rounded-xl">
              <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
                <div className="w-[45px] h-[45px] rounded-[50%] bg-black flex items-center justify-center">
                  <Info className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">محتوى الدورة</h3>
              </div>
              <div className="w-full min-h-[200px] h-fit flex flex-col bg-gray-200 gap-y-4 rounded-xl  p-8">
                <CourseContent />
              </div>
            </div>
            <Feedbacks />
            {/* comments */}
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
    <div className="w-[300px] h-[500px] rounded-xl border py-8">
      <h1 className="text-xl font-bold text-start">
        الدليل الشامل لاستخدام مواقع الويب
      </h1>
      <p>
        حتى تكون الأمور سهلة قمت بتقسيم الدورات لمسارين منفصلين كل مسار يحتوي
        على الدورات التي تحتاج الالتحاق بها لتعلم هذا التخصص.
      </p>
      <div className="w-full h-[30px] flex items-center justify-start">
        <p>199 $</p>
      </div>
      <div className="w-full h-[40px] flex items-center justify-between gap-x-4">
        <button className="w-[200px] h-[40px]  rounded-xl bg-blue-500 flex items-center justify-center text-white">
          اشتري الان
        </button>
        <button className="w-[100px] h-[40px] rounded-xl bg-gray-100 flex items-center justify-center">
          Add
        </button>
      </div>
    </div>
  );
};
