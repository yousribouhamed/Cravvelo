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
import React from "react";
import { makePayment } from "../../../_actions/payments";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formatVideoLength = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  let formattedTime = "";
  if (hours > 0) {
    formattedTime += `${hours} ساعة و `;
  }
  if (minutes > 0) {
    formattedTime += `${minutes} دقيقة و `;
  }
  formattedTime += `${seconds} ثانية`;

  return formattedTime.trim();
};
// {formatVideoDuration(course.length)}

export const Product_card = ({
  course,
  comments,
  color,
  subdomain,
}: {
  course: Course;
  comments: Comment[];
  color: string;
  subdomain: string;
}) => {
  const { actions, state } = useAcademiaStore();

  const expiryTimestamp = new Date();

  const [isFixed, setIsFixed] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 64;
      setIsFixed(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 600 * 6);

  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  return (
    <div
      className={` ${
        isFixed ? "  " : ""
      } w-full lg:w-[350px] relative min-h-[500px] h-fit rounded-xl border p-4 flex flex-col gap-y-4 2xl:sticky 2xl:top-[120px] bg-white mt-6 `}
    >
      {Number(course.price) > 0 && (
        <span
          className=" text-xs text-white p-2 rounded-full absolute -top-5 right-0"
          style={{ backgroundColor: color }}
        >
          dis
          {+" " +
          calculateDiscountPercentage(
            Number(course.price),
            Number(course.compareAtPrice)
          )
            ? calculateDiscountPercentage(
                Number(course.price),
                Number(course.compareAtPrice)
              )
            : 0}
          %
        </span>
      )}
      {Number(course.price) === 0 && (
        <span
          className=" text-xs text-white p-2 rounded-full absolute -top-5 right-0"
          style={{ backgroundColor: color }}
        >
          مجانا
        </span>
      )}
      {Number(course.price) > 0 && (
        <p className="text-2xl font-bold text-start text-black">
          DZD {course.price}.00
        </p>
      )}
      {Number(course.price) > 0 && (
        <p>
          <span className="line-through text-red-500 text-lg">
            DZD {course.compareAtPrice}.00
          </span>{" "}
        </p>
      )}
      {Number(course.price) > 0 ? (
        <button
          data-ripple-light="true"
          onClick={() => {
            actions.addItem({
              type: "COURSE",
              id: course.id,
              imageUrl: course.thumbnailUrl,
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
          {state.shoppingBag.length > 0 ? "ان السلة ممتلئة" : "اضف الى السلة"}
        </button>
      ) : (
        <button
          data-ripple-light="true"
          onClick={async () => {
            setIsLoading(true);
            console.log("the funtion is running right know");
            const url = await makePayment({
              couponCode: null,
              courcesId: [course.id],
              productsId: [],
              subdomain,
            });

            toast("جاري معالجة الطلب", {
              icon: "💸",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
            router.push(url);
            setIsLoading(false);
          }}
          disabled={isLoading}
          className="w-full h-12 rounded-lg  text-white flex items-center justify-center border-black disabled:cursor-not-allowed disabled:opacity-[50%]"
          style={{
            background: color ?? "#FC6B00",
          }}
        >
          {isLoading ? "جاري المعالجة" : "المطالبة بالدورة"}
        </button>
      )}

      <div
        dir="ltr"
        className="w-full h-[20px] flex items-center justify-end  gap-x-2 text-red-500"
      >
        <div className="min-w-[10px] w-fit flex items-center justify-start ">
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
              color: "#000000",
            }}
          />
          <span>
            {calculatePositiveReviewPercentage(
              comments.map((item) => item.rating)
            )}
            % تقييمات إيجابية ({comments?.length ?? 0})
          </span>
        </div>

        <div className="w-full flex items-center justify-start gap-x-4">
          <User
            className="w-5 h-5 "
            style={{
              color: "#000000",
            }}
          />
          <span>{course.studentsNbr ? course.studentsNbr : 0} طالبا</span>
        </div>

        <div className="w-full flex items-center justify-start gap-x-4">
          <Clock
            className="w-5 h-5 "
            style={{
              color: "#000000",
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
              color: "#000000",
            }}
          />
          <span>عبر الإنترنت وبالسرعة التي تناسبك</span>
        </div>
        <div className="w-full flex items-center justify-start gap-x-4">
          <Headphones
            className="w-5 h-5 "
            style={{
              color: "#000000",
            }}
          />
          <span>الصوت: عربي</span>
        </div>

        <div className="w-full flex items-center justify-start gap-x-4">
          <ArrowBigUp
            className="w-5 h-5 "
            style={{
              color: "#000000",
            }}
          />
          <span>المستوى: مبتدئ</span>
        </div>

        <div className="w-full flex items-center justify-start gap-x-4">
          <Infinity
            className="w-5 h-5 "
            style={{
              color: "#000000",
            }}
          />
          <span>وصول غير محدود إلى الأبد</span>
        </div>

        {course.certificate && (
          <div className="w-full flex items-center justify-start gap-x-4">
            <GraduationCap
              className="w-5 h-5 "
              style={{
                color: "#000000",
              }}
            />
            <span>ستحصل على شهادة بعد اتمام الدورة</span>
          </div>
        )}
      </div>
    </div>
  );
};
