"use client";

import { Course } from "database";

export const Product_card = ({ course }: { course: Course }) => {
  return (
    <div className=" w-full lg:w-[350px] min-h-[500px] h-fit rounded-xl border p-4 flex flex-col gap-y-4 lg:sticky lg:top-[100px] ">
      <p className="text-2xl font-bold text-start text-black">
        DZD {course.price}
      </p>
      <p>
        <span className="line-through text-red-500 text-lg">
          DZD {course.compareAtPrice}
        </span>{" "}
        80% dis
      </p>

      <button className="w-full h-12 bg-primary hover:bg-orange-700 text-white flex items-center justify-center border-black">
        ادفع DZD {course.price}
      </button>

      <div className="border-b w-full h-1 my-4" />

      <div className="flex flex-col gap-y-4">
        <span>95% تقييمات إيجابية (80)</span>
        <span>5288 طالبا</span>
        <span>16 درسًا (ساعة و56 دقيقة)</span>
        <span>عبر الإنترنت وبالسرعة التي تناسبك</span>
        <span>الصوت: عربي</span>
        <span>المستوى: مبتدئ</span>
        <span>وصول غير محدود إلى الأبد</span>
      </div>
    </div>
  );
};
