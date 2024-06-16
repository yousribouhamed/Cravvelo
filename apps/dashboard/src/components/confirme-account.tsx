"use client";

import Link from "next/link";
import type { FC } from "react";

const ConfirmeAccount: FC = ({}) => {
  return (
    <div className="w-full min-h-[300px] h-fit mt-8 bg-white rounded-xl shadow border flex items-center  gap-x-4 p-8">
      <div className=" w-[50%] 2xl:w-[60%] h-full flex flex-col items-start justify-start p-4 border rounded-xl">
        <h2 className="text-xl font-bold">بعض الأشياء للإعداد!</h2>

        <div className="w-full h-[50px] flex flex-col items-start p-2 my-4">
          <Link
            href={"/profile"}
            className="flex items-center justify-start gap-x-2"
          >
            <p className="text-lg hover:underline">قم بانهاء ملفك الشخصي</p>
          </Link>
          <p className="text-sm text-gray-500">
            حتى نتمكن من توثيق اكاديميتك ويتمكن طلبك من الاتصال بك
          </p>
        </div>
        <div className="w-full h-[50px] flex flex-col items-start p-2 my-4">
          <Link href={"/courses"}>
            <p className="text-lg hover:underline">قم برفع اول دورة لك</p>
          </Link>
          <p className="text-sm text-gray-500">
            ابدأ رحلتك التعليمية على منصتنا برفع أول دورة لك. شارك معرفتك
            وخبراتك مع المتعلمين حول العالم
          </p>
        </div>
        <div className="w-full h-[50px] flex flex-col items-start p-2 my-4">
          <Link href={"/settings/payments-methods"}>
            <p className="text-lg hover:underline">ادخل وسيلة الدفع</p>
          </Link>
          <p className="text-sm text-gray-500">
            يرجى إدخال وسيلة الدفع الخاصة بك لتسهيل عمليات السحب والإيداع بأمان
            وسرعة
          </p>
        </div>
      </div>
      <div className=" w-[50%] 2xl:w-[40%] h-full flex items-center justify-center">
        <div className="relative w-full h-full">
          <iframe
            width="460"
            height="315"
            className="!rounded-2xl"
            src="https://www.youtube.com/embed/a_feKqxjY-4?si=SDZlRSzMXzjHIkU0"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ConfirmeAccount;
