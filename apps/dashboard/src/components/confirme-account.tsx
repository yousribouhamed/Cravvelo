"use client";

import { Book, CreditCard, PencilRuler, UserRound } from "lucide-react";
import Link from "next/link";
import type { FC } from "react";

const ConfirmeAccount: FC = ({}) => {
  return (
    <div className="w-full min-h-[300px] h-fit mt-8  rounded-xl flex-col-reverse md:flex-col xl:flex-row  flex items-start  gap-6 xl:gap-2  ">
      <div className=" w-full xl:w-[50%] bg-white 2xl:w-[60%] h-full flex flex-col items-start justify-start p-4 md:px-6 px-2 shadow border rounded-xl">
        <h2 className="text-xl font-bold">دعنا نذهب لتأكيد حسابك ❤️</h2>

        <div className="w-full h-fit flex flex-col ">
          <div className="w-full min-h-[30px] h-fit  flex  justify-start items-center gap-x-4 px-4  my-4">
            <div className="bg-primary rounded-xl w-[35px] h-[35px] flex items-center justify-center">
              <UserRound strokeWidth={3} className="text-white" />
            </div>
            <Link
              href={"/profile"}
              className="flex items-center justify-start gap-x-2"
            >
              <p className="text-xl hover:underline">قم بانهاء ملفك الشخصي</p>
            </Link>
          </div>

          <div className="w-full h-fit mr-[40px] px-5">
            <p className="text-md text-gray-500 ">
              يمكن أن يؤدي إكمال ملف التعريف الخاص بك إلى تجربة أكثر تخصيصًا مع
              الميزات والتوصيات المستهدفة
            </p>
          </div>
        </div>

        <div className="w-full h-fit flex flex-col ">
          <div className="w-full min-h-[30px] h-fit  flex  justify-start items-center gap-x-4 px-4  my-4">
            <div className="bg-primary rounded-xl w-[35px] h-[35px] flex items-center justify-center">
              <PencilRuler strokeWidth={3} className="text-white" />
            </div>
            <Link
              href={"/profile"}
              className="flex items-center justify-start gap-x-2"
            >
              <p className="text-lg hover:underline">
                قم بانشاء أكاديمية الخاصة
              </p>
            </Link>
          </div>

          <div className="w-full h-fit mr-[40px] px-5">
            <p className="text-md text-gray-500 ">
              تخطي الوسيط وقم بإنشاء أكاديميتك الخاصة لبيع الدورات التدريبية!
              ستستمتع بالتحكم الكامل في الأسعار والعلامات التجارية وتجربة التعلم
              الشاملة. يتيح لك هذا بناء سمعة قوية مباشرة مع طلابك
            </p>
          </div>
        </div>

        <div className="w-full h-fit flex flex-col ">
          <div className="w-full min-h-[30px] h-fit  flex  justify-start items-center gap-x-4 px-4  my-4">
            <div className="bg-primary rounded-xl w-[35px] h-[35px] flex items-center justify-center">
              <CreditCard strokeWidth={3} className="text-white" />
            </div>
            <Link
              href={"/profile"}
              className="flex items-center justify-start gap-x-2"
            >
              <p className="text-lg hover:underline">ادخل وسيلة الدفع</p>
            </Link>
          </div>

          <div className="w-full h-fit mr-[40px] px-5">
            <p className="text-md text-gray-500 ">
              تبسيط عملية الشراء للطلاب وتمكينك من الحصول على إيرادات من مبيعات
              الدورة التدريبية.
            </p>
          </div>
        </div>

        <div className="w-full h-fit flex flex-col ">
          <div className="w-full min-h-[30px] h-fit  flex  justify-start items-center gap-x-4 px-4  my-4">
            <div className="bg-primary rounded-xl w-[35px] h-[35px] flex items-center justify-center">
              <Book strokeWidth={3} className="text-white" />
            </div>
            <Link
              href={"/profile"}
              className="flex items-center justify-start gap-x-2"
            >
              {" "}
              <p className="text-lg hover:underline">
                {" "}
                قم بتخصيص سياسة الاكاديمية
              </p>
            </Link>
          </div>

          <div className="w-full h-fit mr-[40px] px-5">
            <p className="text-md text-gray-500 ">
              يعد إنشاء سياسة الخصوصية أمرًا حيويًا لنجاحك الأكاديمي. إنه يبني
              الثقة مع طلابك من خلال تحديد كيفية التعامل مع المعلومات بوضوح.
            </p>
          </div>
        </div>
      </div>
      <div className=" w-full xl:w-[50%] p-4 2xl:w-[40%] min-h-[350px] rounded-2xl h-fit flex items-center flex-col gap-y-4 bg-white shadow border justify-start">
        <div className="h-[20%]  w-full flex items-start justify-start">
          <h3 className="text-xl font-bold ">
            استعد لبدء بيع دوراتك ومنتجاتك الرقمية
          </h3>
        </div>
        <div className="relative w-full h-[80%] flex items-center justify-center">
          <iframe
            width="450"
            height="270"
            className="!rounded-2xl"
            src="https://www.youtube.com/embed/"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ConfirmeAccount;
