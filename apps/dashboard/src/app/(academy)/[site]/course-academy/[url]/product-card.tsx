"use client";

import { Course } from "database";
import { useAcademiaStore } from "../../../global-state/academia-store";
import { ArrowBigUp, Headphones, Clock, User, Star, Globe } from "lucide-react";
import { Infinity } from "lucide-react";

export const Product_card = ({
  course,
  color,
}: {
  course: Course;
  color: string;
}) => {
  const { actions, state } = useAcademiaStore();
  return (
    <div className=" w-full lg:w-[350px] min-h-[500px] h-fit rounded-xl border p-4 flex flex-col gap-y-4 lg:sticky lg:top-[100px] bg-white">
      <p className="text-2xl font-bold text-start text-black">
        DZD {course.price}.00
      </p>
      <p>
        <span className="line-through text-red-500 text-lg">
          DZD {course.compareAtPrice}.00
        </span>{" "}
        80% dis
      </p>

      <button
        onClick={() => {
          actions.addItem({
            id: course.id,
            imageUrl: course.thumnailUrl,
            name: course.title,
            price: course.price.toString(),
          });
        }}
        disabled={state.shoppingBag.length > 0}
        className="w-full h-12 rounded-lg  text-white flex items-center justify-center border-black disabled:cursor-not-allowed disabled:opacity-[50%]"
        style={{
          background: color ?? "#FC6B00",
        }}
      >
        ادفع DZD {course.price}.00
      </button>

      <div className="border-b w-full h-1 my-4" />

      <div className="flex flex-col gap-y-4">
        <div className="w-full flex items-center justify-start gap-x-4">
          <Star className="w-5 h-5 " />
          <span>95% تقييمات إيجابية (80)</span>
        </div>

        <div className="w-full flex items-center justify-start gap-x-4">
          <User className="w-5 h-5 " />
          <span>{course.studenstNbr} طالبا</span>
        </div>

        <div className="w-full flex items-center justify-start gap-x-4">
          <Clock className="w-5 h-5 " />
          <span>{course.nbrChapters} درسًا (ساعة و56 دقيقة)</span>
        </div>

        <div className="w-full flex items-center justify-start gap-x-4">
          <Globe className="w-5 h-5 " />
          <span>عبر الإنترنت وبالسرعة التي تناسبك</span>
        </div>
        <div className="w-full flex items-center justify-start gap-x-4">
          <Headphones className="w-5 h-5 " />
          <span>الصوت: عربي</span>
        </div>

        <div className="w-full flex items-center justify-start gap-x-4">
          <ArrowBigUp className="w-5 h-5 " />
          <span>المستوى: مبتدئ</span>
        </div>

        <div className="w-full flex items-center justify-start gap-x-4">
          <Infinity className="w-5 h-5 " />
          <span>وصول غير محدود إلى الأبد</span>
        </div>
      </div>
    </div>
  );
};
