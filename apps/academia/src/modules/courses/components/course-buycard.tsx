"use client";

import BrandButton from "@/components/brand-button";
import { formatPrice } from "@/lib/price";
import {
  Star,
  User,
  Clock,
  Globe,
  Headphones,
  ArrowBigUp,
  Infinity,
  GraduationCap,
} from "lucide-react";
import { CourseWithPricing } from "../types";
import { usePaymentIntent } from "@/modules/payments/hooks/use-paymentIntent";
import { courseToPaymentProduct } from "@/modules/payments/utils";

interface CourseCardProps {
  course: CourseWithPricing;
}

const calculatePositiveReviewPercentage = (ratings: number[]) => {
  if (!ratings || ratings.length === 0) return 0;
  const positiveRatings = ratings.filter((rating) => rating >= 4).length;
  return Math.round((positiveRatings / ratings.length) * 100);
};

const formatVideoLength = (totalSeconds: number) => {
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

export default function CourseBuyCard({ course }: CourseCardProps) {
  const { invokePaymentIntent } = usePaymentIntent(
    courseToPaymentProduct({
      course,
    })
  );

  // Get the default pricing plan
  const defaultPricingPlan = course.CoursePricingPlans?.find(
    (plan) => plan.isDefault
  )?.PricingPlan;

  // Determine if the course is free
  const isFree =
    defaultPricingPlan?.pricingType === "FREE" ||
    (defaultPricingPlan?.price !== null &&
      //@ts-expect-error
      Number(defaultPricingPlan.price) === 0);

  // Get actual ratings from comments
  const ratings = course.Comment?.map((comment) => comment.rating) || [];

  return (
    <div className="w-full lg:w-[350px] bg-card text-card-foreground min-h-[500px] h-fit rounded-xl border p-4 flex flex-col gap-y-4  mt-6 sticky top-[120px]">
      {/* Free Badge */}
      {isFree && (
        <span className="text-xs text-white p-2 rounded-full absolute -top-5 right-0 bg-[#FC6B00]">
          مجانا
        </span>
      )}

      {/* Price Section */}
      {!isFree && defaultPricingPlan?.price && (
        <p className="text-2xl font-bold text-start text-black dark:text-white">
          {formatPrice(Number(defaultPricingPlan.price))}
        </p>
      )}

      <BrandButton onClick={invokePaymentIntent}>bug now</BrandButton>

      <div className="border-b w-full h-1 my-1 dark:border-gray-700" />

      {/* Course Details */}
      <div className="flex flex-col gap-y-4">
        {/* Reviews */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <Star className="w-5 h-5 text-black dark:text-white" />
          <span className="text-black dark:text-white">
            {calculatePositiveReviewPercentage(ratings)}% تقييمات إيجابية (
            {ratings.length})
          </span>
        </div>

        {/* Students */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <User className="w-5 h-5 text-black dark:text-white" />
          <span className="text-black dark:text-white">
            {course?.studentsNbr || 0} طالبا
          </span>
        </div>

        {/* Duration */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <Clock className="w-5 h-5 text-black dark:text-white" />
          <span className="text-black dark:text-white">
            {course?.nbrChapters || 0} درسًا
            {course?.length && ` (${formatVideoLength(course.length)})`}
          </span>
        </div>

        {/* Online Access */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <Globe className="w-5 h-5 text-black dark:text-white" />
          <span className="text-black dark:text-white">
            عبر الإنترنت وبالسرعة التي تناسبك
          </span>
        </div>

        {/* Language */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <Headphones className="w-5 h-5 text-black dark:text-white" />
          <span className="text-black dark:text-white">
            الصوت:{" "}
            {course?.sound === "ARABIC"
              ? "عربي"
              : course?.sound === "FRENCH"
              ? "فرنسي"
              : "انجليزي"}
          </span>
        </div>

        {/* Level */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <ArrowBigUp className="w-5 h-5 text-black dark:text-white" />
          <span className="text-black dark:text-white">
            المستوى:{" "}
            {course?.level === "BEGINNER"
              ? "مبتدئ"
              : course?.level === "INTERMEDIATE"
              ? "متوسط"
              : "متقدم"}
          </span>
        </div>

        {/* Access Type */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <Infinity className="w-5 h-5 text-black dark:text-white" />
          <span className="text-black dark:text-white">
            {defaultPricingPlan?.pricingType === "FREE"
              ? "وصول مجاني غير محدود"
              : defaultPricingPlan?.pricingType === "RECURRING"
              ? `وصول لمدة ${
                  defaultPricingPlan?.recurringDays || 30
                } يوم (متجدد)`
              : defaultPricingPlan?.accessDuration === "UNLIMITED"
              ? "وصول غير محدود إلى الأبد"
              : defaultPricingPlan?.accessDuration === "LIMITED" &&
                defaultPricingPlan?.accessDurationDays
              ? `وصول لمدة ${defaultPricingPlan.accessDurationDays} يوم`
              : "وصول غير محدود إلى الأبد"}
          </span>
        </div>

        {/* Certificate */}
        {course?.certificate && (
          <div className="w-full flex items-center justify-start gap-x-4">
            <GraduationCap className="w-5 h-5 text-black dark:text-white" />
            <span className="text-black dark:text-white">
              ستحصل على شهادة بعد اتمام الدورة
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
