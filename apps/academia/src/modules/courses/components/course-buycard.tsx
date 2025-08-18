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
import { Course } from "../types";

interface CourseCardProps {
  course: Course;
}

const calculateDiscountPercentage = (price: number, compareAtPrice: number) => {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
};

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
  // Mock data for demonstration - replace with actual data from your course object
  const mockComments = [
    { rating: 5 },
    { rating: 4 },
    { rating: 5 },
    { rating: 3 },
    { rating: 4 },
  ];

  return (
    <div className="w-full lg:w-[350px] bg-card text-card-foreground min-h-[500px] h-fit rounded-xl border p-4 flex flex-col gap-y-4  mt-6 sticky top-[120px]">
      {/* Discount Badge */}
      {course?.price && course?.compareAtPrice && Number(course.price) > 0 && (
        <span className="text-xs text-white p-2 rounded-full absolute -top-5 right-0 bg-[#FC6B00]">
          تخفيض{" "}
          {calculateDiscountPercentage(
            Number(course.price),
            Number(course.compareAtPrice)
          )}
          %
        </span>
      )}

      {/* Free Badge */}
      {course?.price && Number(course.price) === 0 && (
        <span className="text-xs text-white p-2 rounded-full absolute -top-5 right-0 bg-[#FC6B00]">
          مجانا
        </span>
      )}

      {/* Price Section */}
      {course?.price && Number(course.price) > 0 && (
        <>
          <p className="text-2xl font-bold text-start text-black dark:text-white">
            {formatPrice(Number(course.price))}
          </p>
          {course?.compareAtPrice && (
            <p>
              <span className="line-through text-red-500 text-lg">
                {formatPrice(Number(course.compareAtPrice))}
              </span>
            </p>
          )}
        </>
      )}

      {/* Action Button */}
      <BrandButton>
        {course?.price && Number(course.price) === 0
          ? "المطالبة بالدورة"
          : "اشتري الآن"}
      </BrandButton>

      {/* Timer Section (if needed) */}
      <div
        dir="ltr"
        className="w-full h-[20px] flex items-center justify-end gap-x-2 text-red-500"
      >
        <div className="min-w-[10px] w-fit flex items-center justify-start">
          <span className="text-sm">00</span>:
          <span className="text-sm">00</span>:
          <span className="text-sm">00</span>
        </div>
        <span className="text-sm">ينتهي هذا العرض عند</span>
      </div>

      <div className="border-b w-full h-1 my-1 dark:border-gray-700" />

      {/* Course Details */}
      <div className="flex flex-col gap-y-4">
        {/* Reviews */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <Star className="w-5 h-5 text-black dark:text-white" />
          <span className="text-black dark:text-white">
            {calculatePositiveReviewPercentage(
              mockComments.map((c) => c.rating)
            )}
            % تقييمات إيجابية ({mockComments.length})
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

        {/* Lifetime Access */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <Infinity className="w-5 h-5 text-black dark:text-white" />
          <span className="text-black dark:text-white">
            وصول غير محدود إلى الأبد
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
