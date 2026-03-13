"use client";

import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useIsAuthenticated, useTenantCurrency } from "@/hooks/use-tenant";
import { claimFreeItemAccess } from "@/modules/payments/actions/free-access.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourseCardProps {
  course: CourseWithPricing;
  isOwned?: boolean;
  courseId: string;
}

const calculatePositiveReviewPercentage = (ratings: number[]) => {
  if (!ratings || ratings.length === 0) return 0;
  const positiveRatings = ratings.filter((rating) => rating >= 4).length;
  return Math.round((positiveRatings / ratings.length) * 100);
};

const formatVideoLength = (totalSeconds: number, t: any) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  let formattedTime = "";
  if (hours > 0) {
    formattedTime += `${hours} ${t("buyCard.hours")} ${t("buyCard.and")} `;
  }
  if (minutes > 0) {
    formattedTime += `${minutes} ${t("buyCard.minutes")} ${t("buyCard.and")} `;
  }
  formattedTime += `${seconds} ${t("buyCard.seconds")}`;

  return formattedTime.trim();
};

export default function CourseBuyCard({
  course,
  isOwned = false,
  courseId,
}: CourseCardProps) {
  const router = useRouter();
  const t = useTranslations("courses");
  const { formatPrice, currency } = useTenantCurrency();
  const isAuthenticated = useIsAuthenticated();
  const [isClaimingFree, setIsClaimingFree] = useState(false);
  const { invokePaymentIntent } = usePaymentIntent(
    courseToPaymentProduct({
      course,
      tenantCurrency: currency,
    })
  );

  // Get the default pricing plan, or fallback to first available plan
  const defaultPricingPlan =
    course.CoursePricingPlans?.find((plan) => plan.isDefault)
      ?.PricingPlan ||
    course.CoursePricingPlans?.find((plan) => plan.PricingPlan != null)
      ?.PricingPlan ||
    null;

  // Determine if the course is free
  const isFree =
    !defaultPricingPlan ||
    defaultPricingPlan.pricingType === "FREE" ||
    (defaultPricingPlan.price !== null &&
      defaultPricingPlan.price !== undefined &&
      Number(defaultPricingPlan.price) === 0);

  // Get actual ratings from comments
  const ratings = course.Comment?.map((comment) => comment.rating) || [];

  const handlePrimaryAction = async () => {
    if (isFree) {
      if (!isAuthenticated) {
        router.push(`/login?redirect=/courses/${courseId}`);
        return;
      }

      try {
        setIsClaimingFree(true);
        const result = await claimFreeItemAccess({
          productId: courseId,
          type: "COURSE",
        });

        if (!result.success) {
          toast.error(result.message || "Failed to unlock free course");
          return;
        }

        toast.success(t("buyCard.watchNow"));
        router.push(`/courses/${courseId}/watch`);
      } catch (error) {
        console.error(error);
        toast.error("Failed to unlock free course");
      } finally {
        setIsClaimingFree(false);
      }
      return;
    }

    invokePaymentIntent();
  };

  return (
    <div className="w-full bg-card text-card-foreground min-h-0 md:min-h-[500px] h-fit rounded-xl border p-4 flex flex-col gap-y-4 mt-6 md:sticky md:top-[86px]">
      {/* Free Badge */}
      {isFree && (
        <span className="text-xs text-white p-2 rounded-full absolute -top-5 right-0 bg-[#FC6B00]">
          {t("buyCard.freeBadge")}
        </span>
      )}

      {/* Price Section */}
      {!isFree &&
        !isOwned &&
        defaultPricingPlan &&
        defaultPricingPlan.price !== null &&
        defaultPricingPlan.price !== undefined && (
          <p className="text-2xl font-bold text-start text-foreground">
            {formatPrice(Number(defaultPricingPlan.price))}
          </p>
        )}

      {isOwned ? (
        <Button className="w-full" asChild>
          <Link href={`/courses/${courseId}/watch`}>{t("buyCard.watchNow")}</Link>
        </Button>
      ) : (
        <>
          <Button
            onClick={handlePrimaryAction}
            className="w-full"
            loading={isClaimingFree}
            disabled={isClaimingFree}
          >
            {t("buyCard.buyNow")}
          </Button>
          <Link href={`/login?redirect=/courses/${courseId}`}>
            <button className="text-sm underline text-muted-foreground hover:text-foreground text-right w-full">
              {t("buyCard.alreadyHaveAccount")}
            </button>
          </Link>
        </>
      )}

      <div className="border-b w-full h-1 my-1 dark:border-gray-700" />

      {/* Course Details */}
      <div className="flex flex-col gap-y-4">
        {/* Reviews */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <Star className="w-5 h-5 text-foreground" />
          <span className="text-foreground">
            {t("buyCard.positiveReviews", {
              percentage: calculatePositiveReviewPercentage(ratings),
              count: ratings.length,
            })}
          </span>
        </div>

        {/* Students */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <User className="w-5 h-5 text-foreground" />
          <span className="text-foreground">
            {t("buyCard.students", { count: course?.studentsNbr || 0 })}
          </span>
        </div>

        {/* Duration */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <Clock className="w-5 h-5 text-foreground" />
          <span className="text-foreground">
            {t("buyCard.duration", {
              chapters: course?.nbrChapters || 0,
              length: course?.length ? ` (${formatVideoLength(course.length, t)})` : "",
            })}
          </span>
        </div>

        {/* Online Access */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <Globe className="w-5 h-5 text-foreground" />
          <span className="text-foreground">
            {t("buyCard.onlineAccess")}
          </span>
        </div>

        {/* Language */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <Headphones className="w-5 h-5 text-foreground" />
          <span className="text-foreground">
            {t("buyCard.language")}:{" "}
            {course?.sound === "ARABIC"
              ? t("buyCard.languageArabic")
              : course?.sound === "FRENCH"
              ? t("buyCard.languageFrench")
              : t("buyCard.languageEnglish")}
          </span>
        </div>

        {/* Level */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <ArrowBigUp className="w-5 h-5 text-foreground" />
          <span className="text-foreground">
            {t("buyCard.level")}:{" "}
            {course?.level === "BEGINNER"
              ? t("level.beginner")
              : course?.level === "INTERMEDIATE"
              ? t("level.intermediate")
              : t("level.advanced")}
          </span>
        </div>

        {/* Access Type */}
        <div className="w-full flex items-center justify-start gap-x-4">
          <Infinity className="w-5 h-5 text-foreground" />
          <span className="text-foreground">
            {!defaultPricingPlan
              ? t("buyCard.accessUnlimited")
              : defaultPricingPlan.pricingType === "FREE"
              ? t("buyCard.accessFreeUnlimited")
              : defaultPricingPlan.pricingType === "RECURRING"
              ? t("buyCard.accessRecurring", {
                  days: defaultPricingPlan.recurringDays || 30,
                })
              : defaultPricingPlan.accessDuration === "UNLIMITED"
              ? t("buyCard.accessUnlimited")
              : defaultPricingPlan.accessDuration === "LIMITED" &&
                defaultPricingPlan.accessDurationDays
              ? t("buyCard.accessLimited", {
                  days: defaultPricingPlan.accessDurationDays,
                })
              : t("buyCard.accessUnlimited")}
          </span>
        </div>

        {/* Certificate */}
        {course?.certificate && (
          <div className="w-full flex items-center justify-start gap-x-4">
            <GraduationCap className="w-5 h-5 text-foreground" />
            <span className="text-foreground">
              {t("buyCard.certificate")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
