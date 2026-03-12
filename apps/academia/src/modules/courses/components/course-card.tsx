"use client";

import Image from "next/image";
import Link from "next/link";
import { CourseWithPricing } from "../types";
import { Rating } from "@smastrom/react-rating";
import { BookOpen, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { useTenantCurrency, useTenantThemeStyles } from "@/hooks/use-tenant";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: CourseWithPricing;
  isOwned?: boolean;
}

export default function CourseCard({
  course,
  isOwned = false,
}: CourseCardProps) {
  const t = useTranslations("courses");
  const { formatPrice } = useTenantCurrency();
  const { courseCardStyle } = useTenantThemeStyles();
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

  // Get level translation
  const getLevelText = (level: string | null) => {
    switch (level) {
      case "BEGINNER":
        return t("level.beginner");
      case "INTERMEDIATE":
        return t("level.intermediate");
      case "ADVANCED":
        return t("level.advanced");
      default:
        return t("level.unspecified");
    }
  };

  // Get pricing display text
  const getPricingDisplay = () => {
    if (isFree) {
      return {
        main: t("pricing.free"),
        badge: t("pricing.free"),
        badgeVariant: "success" as const,
      };
    }

    if (isRecurring) {
      const recurringText = defaultPricing?.recurringDays
        ? t("pricing.recurringDays", { days: defaultPricing.recurringDays })
        : t("pricing.subscription");
      return {
        main: formatPrice(currentPrice),
        badge: t("pricing.subscription"),
        badgeVariant: "secondary" as const,
        subtitle: recurringText,
      };
    }

    return {
      main: formatPrice(currentPrice),
      badge: t("pricing.paid"),
      badgeVariant: "outline" as const,
    };
  };

  const pricingDisplay = getPricingDisplay();
  const salesCount = _count?.Sale ?? 0;

  const isCompact = courseCardStyle === "COMPACT";
  const isMinimal = courseCardStyle === "MINIMAL";
  const isFeatured = courseCardStyle === "FEATURED";

  return (
    <Link
      href={isOwned ? `/courses/${id}/watch` : `/courses/${id}`}
      className="block"
      data-course-card-style={courseCardStyle}
    >
      <div
        className={cn(
          "academia-card group w-full flex bg-card border border-border hover:border-primary/20 transition-all duration-200 hover:shadow-xl hover:ring-2 hover:ring-primary/10 overflow-hidden",
          isMinimal && "flex-row min-h-0 items-stretch",
          !isMinimal && "flex-col",
          isCompact && "min-h-[300px]",
          isMinimal && "min-h-[88px]",
          !isCompact && !isMinimal && !isFeatured && "min-h-[400px]",
          isFeatured && "min-h-[420px]",
        )}
        style={{ borderRadius: "var(--academia-card-radius, 1rem)" }}
      >
        {/* Thumbnail Section - hidden for MINIMAL */}
        {!isMinimal && (
        <div className={cn("relative overflow-hidden shrink-0", isFeatured && "relative")}>
          {thumbnailUrl ? (
            <Image
              alt={title}
              src={thumbnailUrl}
              width={400}
              height={224}
              className={cn(
                "w-full object-cover group-hover:scale-105 transition-transform duration-200",
                isCompact && "h-36",
                isFeatured && "h-64",
                !isCompact && !isFeatured && "h-56",
              )}
            />
          ) : (
            <div
              className={cn(
                "w-full bg-muted flex items-center justify-center",
                isCompact && "h-36",
                isFeatured && "h-64",
                !isCompact && !isFeatured && "h-56",
              )}
            >
              <BookOpen className={cn("text-muted-foreground", isCompact && "w-12 h-12", "w-14 h-14")} aria-hidden />
            </div>
          )}

          {isFeatured && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
          )}

          {/* Level Badge */}
          <div className="absolute top-3 right-3">
            <Badge
              variant="secondary"
              className="bg-card/90 text-card-foreground hover:bg-card/90"
            >
              {getLevelText(level)}
            </Badge>
          </div>

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500 text-white hover:bg-red-500">
                {t("discount")}{" "}
                {Math.round(
                  ((originalPrice! - currentPrice) / originalPrice!) * 100
                )}
                %
              </Badge>
            </div>
          )}
        </div>
        )}

        {/* Content Section */}
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0",
            isMinimal && "p-4 flex-row items-center gap-4 justify-between",
            !isMinimal && "flex-col",
            isMinimal && "space-y-0",
            isCompact && "p-4 space-y-2",
            (isFeatured || courseCardStyle === "DEFAULT") && "p-6 space-y-4",
          )}
        >
          <div className={cn("flex-1 min-w-0", isMinimal && "flex flex-col justify-center gap-0.5")}>
          {/* Title */}
          <h3
            className={cn(
              "font-semibold text-card-foreground leading-snug group-hover:text-primary transition-colors text-start",
              isMinimal && "text-sm line-clamp-1",
              isCompact && "text-base line-clamp-1",
              !isMinimal && !isCompact && "text-lg line-clamp-2",
            )}
          >
            {title}
          </h3>

          {/* Trainers - hidden in COMPACT for space */}
          {trainers && !isCompact && (
            <p className={cn("text-sm text-muted-foreground text-start", isMinimal && "text-xs truncate")}>
              {t("trainer")}: {trainers}
            </p>
          )}

          {/* Rating and Sales - hidden in MINIMAL/COMPACT */}
          {!isMinimal && !isCompact && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rating
                value={rating}
                readOnly
                style={{ maxWidth: 80 }}
                className="text-yellow-500"
              />
              <span className="text-sm text-muted-foreground">
                {rating.toFixed(1)}
              </span>
            </div>

            {salesCount > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{salesCount} {t("student")}</span>
              </div>
            )}
          </div>
          )}

          {/* Price Section */}
          <div className={cn("flex items-center justify-between shrink-0", !isMinimal && "pt-2")}>
            {isOwned ? (
              <div className="flex items-center gap-2 w-full">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30">
                  {t("accessCourse")}
                </Badge>
              </div>
            ) : (
              <>
                <div className="flex flex-col">
                  {/* Main Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-card-foreground">
                      {pricingDisplay.main}
                    </span>
                    {/* Original Price (if discounted) */}
                    {hasDiscount && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(originalPrice!)}
                      </span>
                    )}
                  </div>

                  {/* Subscription Info */}
                  {pricingDisplay.subtitle && (
                    <span className="text-xs text-muted-foreground">
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
                      ? "border-primary/30 text-primary"
                      : ""
                  }
                >
                  {pricingDisplay.badge}
                </Badge>
              </>
            )}
          </div>

          {/* Multiple Pricing Options Indicator - hidden in MINIMAL/COMPACT */}
          {!isMinimal && !isCompact && CoursePricingPlans && CoursePricingPlans.length > 1 && (
            <div className="pt-2 border-t border-border">
              <span className="text-xs text-primary font-medium text-start">
                {t("pricingOptionsAvailable", { count: CoursePricingPlans.length })}
              </span>
            </div>
          )}
        </div>
      </div>
      </div>
    </Link>
  );
}
