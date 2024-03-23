"use client";

import { Course, Comment } from "database";
import { useAcademiaStore } from "../../../global-state/academia-store";
import { ArrowBigUp, Headphones, Clock, User, Star, Globe } from "lucide-react";
import { Infinity } from "lucide-react";
import { GraduationCap } from "lucide-react";
import {
  calculateDiscountPercentage,
  calculatePositiveReviewPercentage,
  formatVideoDuration,
} from "../../../lib";
import { useTimer } from "react-timer-hook";

const formatVideoLength = (sizeInBytes) => {
  const totalSeconds = sizeInBytes / 1000; // Convert bytes to seconds
  const OurHours = Math.floor(totalSeconds / 3600);
  const OurMinutes = Math.floor((totalSeconds % 3600) / 60);
  const OurSeconds = Math.floor(totalSeconds % 60);

  const expiryTimestamp = new Date();

  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 600 * 12);

  let formattedTime = "";
  if (OurHours > 0) {
    formattedTime += `${OurHours} ساعة و `;
  }
  if (OurMinutes > 0) {
    formattedTime += `${OurMinutes} دقيقة و `;
  }
  formattedTime += `${OurSeconds} ثانية`;

  return formattedTime.trim();
};

// {formatVideoDuration(course.length)}

export const Product_card = ({
  course,
  comments,
  color,
}: {
  course: Course;
  comments: Comment[];
  color: string;
}) => {
  const { actions, state } = useAcademiaStore();

  const expiryTimestamp = new Date();

  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 600 * 6);

  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });
  return (
    <div className=" w-full lg:w-[350px] min-h-[500px] h-fit rounded-xl border p-4 flex flex-col gap-y-4 lg:sticky lg:top-[100px] bg-white">
      <p className="text-2xl font-bold text-start text-black">
        DZD {course.price}.00
      </p>
      <p>
        <span className="line-through text-red-500 text-lg">
          DZD {course.compareAtPrice}.00
        </span>{" "}
        {calculateDiscountPercentage(
          Number(course.price),
          Number(course.compareAtPrice)
        )}
        % dis
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
        اضف الى السلة
      </button>

      <div
        dir="ltr"
        className="w-full h-[20px] flex items-center justify-end  gap-x-4 text-red-500"
      >
        <div className="w-[100px] flex items-center justify-start gap-x-2">
          <span className="text-sm ">{hours}</span>:
          <span className="text-sm ">{minutes}</span>:
          <span className="text-sm ">{seconds}</span>
        </div>
        <span className=" text-sm">ينتهي هذا العرض عند</span>
      </div>

      <div className="border-b w-full h-1 my-1" />

      <div className="flex flex-col gap-y-4">
        <div className="w-full flex items-center justify-start gap-x-4">
          <Star
            className="w-5 h-5 "
            style={{
              color: color ?? "#FC6B00",
            }}
          />
          <span>
            {calculatePositiveReviewPercentage(
              comments.map((item) => item.rating)
            )}
            % تقييمات إيجابية ({comments.length})
          </span>
        </div>

        <div className="w-full flex items-center justify-start gap-x-4">
          <User
            className="w-5 h-5 "
            style={{
              color: color ?? "#FC6B00",
            }}
          />
          <span>{course.studenstNbr ? course.studenstNbr : 0} طالبا</span>
        </div>

        <div className="w-full flex items-center justify-start gap-x-4">
          <Clock
            className="w-5 h-5 "
            style={{
              color: color ?? "#FC6B00",
            }}
          />
          <span>
            {course.nbrChapters} درسًا ( {formatVideoLength(course.length)})
          </span>
        </div>

        <div className="w-full flex items-center justify-start gap-x-4">
          <Globe
            className="w-5 h-5 "
            style={{
              color: color ?? "#FC6B00",
            }}
          />
          <span>عبر الإنترنت وبالسرعة التي تناسبك</span>
        </div>
        <div className="w-full flex items-center justify-start gap-x-4">
          <Headphones
            className="w-5 h-5 "
            style={{
              color: color ?? "#FC6B00",
            }}
          />
          <span>الصوت: عربي</span>
        </div>

        <div className="w-full flex items-center justify-start gap-x-4">
          <ArrowBigUp
            className="w-5 h-5 "
            style={{
              color: color ?? "#FC6B00",
            }}
          />
          <span>المستوى: مبتدئ</span>
        </div>

        <div className="w-full flex items-center justify-start gap-x-4">
          <Infinity
            className="w-5 h-5 "
            style={{
              color: color ?? "#FC6B00",
            }}
          />
          <span>وصول غير محدود إلى الأبد</span>
        </div>

        {course.certificate && (
          <div className="w-full flex items-center justify-start gap-x-4">
            <GraduationCap
              className="w-5 h-5 "
              style={{
                color: color ?? "#FC6B00",
              }}
            />
            <span>ستحصل على شهادة بعد اتمام الدورة</span>
          </div>
        )}
      </div>
    </div>
  );
};
