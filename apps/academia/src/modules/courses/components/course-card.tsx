"use client";

import Image from "next/image";
import Link from "next/link";
import { CourseWithPricing } from "../types";
import { Rating } from "@smastrom/react-rating";
import { BookOpen, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  course: CourseWithPricing;
}

export default function CourseCard({ course }: CourseCardProps) {
  const {
    id,
    thumbnailUrl,
    title,
    rating,
    level,
    trainers,
    CoursePricingPlans,
    _count,
  } = course;

  // Get the default pricing plan
  const defaultPricing = CoursePricingPlans?.find(
    (plan) => plan.isDefault
  )?.PricingPlan;

  // Determine pricing information
  const isFree =
    defaultPricing?.pricingType === "FREE" || defaultPricing?.price === 0;
  const isRecurring = defaultPricing?.pricingType === "RECURRING";

  // Use new pricing system
  const currentPrice = defaultPricing?.price ?? 0;
  const originalPrice = defaultPricing?.compareAtPrice;

  // Check if there's a discount
  const hasDiscount = originalPrice && originalPrice > currentPrice;

  // Format prices in Arabic locale
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get level in Arabic
  const getLevelInArabic = (level: string | null) => {
    switch (level) {
      case "BEGINNER":
        return "مبتدئ";
      case "INTERMEDIATE":
        return "متوسط";
      case "ADVANCED":
        return "متقدم";
      default:
        return "غير محدد";
    }
  };

  // Get pricing display text in Arabic
  const getPricingDisplay = () => {
    if (isFree) {
      return {
        main: "مجاني",
        badge: "مجاني",
        badgeVariant: "success" as const,
      };
    }

    if (isRecurring) {
      const recurringText = defaultPricing?.recurringDays
        ? `كل ${defaultPricing.recurringDays} يوم`
        : "اشتراك";
      return {
        main: formatPrice(currentPrice),
        badge: "اشتراك",
        badgeVariant: "secondary" as const,
        subtitle: recurringText,
      };
    }

    return {
      main: formatPrice(currentPrice),
      badge: "مدفوع",
      badgeVariant: "outline" as const,
    };
  };

  const pricingDisplay = getPricingDisplay();
  const salesCount = _count?.Sale ?? 0;

  return (
    <Link href={`/courses/${id}`} className="block">
      <div className="group w-full bg-white dark:bg-[#0A0A0C] rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-lg overflow-hidden">
        {/* Thumbnail Section */}
        <div className="relative overflow-hidden">
          {thumbnailUrl ? (
            <Image
              alt={title}
              src={thumbnailUrl}
              width={400}
              height={200}
              className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
          )}

          {/* Level Badge */}
          <div className="absolute top-3 right-3">
            <Badge
              variant="secondary"
              className="bg-white/90 text-gray-900 hover:bg-white/90"
            >
              {getLevelInArabic(level)}
            </Badge>
          </div>

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500 text-white hover:bg-red-500">
                خصم{" "}
                {Math.round(
                  ((originalPrice! - currentPrice) / originalPrice!) * 100
                )}
                %
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-right">
            {title}
          </h3>

          {/* Trainers */}
          {trainers && (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-right">
              المدرب: {trainers}
            </p>
          )}

          {/* Rating and Sales */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rating
                value={rating}
                readOnly
                style={{ maxWidth: 80 }}
                className="text-yellow-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {rating.toFixed(1)}
              </span>
            </div>

            {salesCount > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>{salesCount} طالب</span>
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              {/* Main Price */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {pricingDisplay.main}
                </span>
                {/* Original Price (if discounted) */}
                {hasDiscount && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(originalPrice!)}
                  </span>
                )}
              </div>

              {/* Subscription Info */}
              {pricingDisplay.subtitle && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {pricingDisplay.subtitle}
                </span>
              )}
            </div>

            {/* Pricing Badge */}
            <Badge
              variant={pricingDisplay.badgeVariant}
              className={
                pricingDisplay.badgeVariant === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                  : pricingDisplay.badgeVariant === "outline"
                  ? "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
                  : ""
              }
            >
              {pricingDisplay.badge}
            </Badge>
          </div>

          {/* Multiple Pricing Options Indicator */}
          {CoursePricingPlans && CoursePricingPlans.length > 1 && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium text-right">
                {CoursePricingPlans.length} خيارات تسعير متاحة
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
