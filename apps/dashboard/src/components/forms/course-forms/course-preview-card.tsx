"use client";

import Image from "next/image";
import { BookOpen, Users, Star } from "lucide-react";
import { Badge } from "@ui/components/ui/badge";
import { Avatar, AvatarFallback } from "@ui/components/ui/avatar";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/src/hooks/use-currency";

export interface CoursePreviewCardCourse {
  thumbnailUrl: string | null;
  title: string | null;
  rating: number;
  level: string | null;
  trainers: string | null;
  CoursePricingPlans?: Array<{
    isDefault: boolean;
    PricingPlan: {
      price: number | null;
      compareAtPrice: number | null;
      pricingType: string;
      accessDuration: string | null;
      accessDurationDays: number | null;
    };
  }>;
  _count?: { Sale: number };
}

interface CoursePreviewCardProps {
  course: CoursePreviewCardCourse;
}

export function CoursePreviewCard({ course }: CoursePreviewCardProps) {
  const t = useTranslations("courses.publishCourse");
  const tLevel = useTranslations("courses.courseSettings.levels");
  const { formatPrice } = useCurrency();

  const { thumbnailUrl, title, rating, level, trainers, CoursePricingPlans, _count } = course;
  const defaultPricing = CoursePricingPlans?.find((p) => p.isDefault)?.PricingPlan;
  const isFree = defaultPricing?.pricingType === "FREE" || (defaultPricing?.price ?? 0) === 0;
  const currentPrice = defaultPricing?.price ?? 0;
  const originalPrice = defaultPricing?.compareAtPrice;
  const hasDiscount = originalPrice != null && originalPrice > currentPrice;
  const salesCount = _count?.Sale ?? 0;

  const getLevelText = (levelVal: string | null) => {
    if (!levelVal) return "—";
    switch (levelVal) {
      case "BEGINNER":
        return tLevel("beginner");
      case "INTERMEDIATE":
        return tLevel("intermediate");
      case "ADVANCED":
        return tLevel("advanced");
      default:
        return levelVal;
    }
  };

  const pricingMain = isFree ? t("free") : formatPrice(currentPrice);
  const pricingBadge = isFree ? t("free") : t("paid");

  return (
    <div className="w-full max-w-md">
      <p className="text-xs font-medium text-muted-foreground mb-2">{t("previewOnAcademy")}</p>
      <div className="w-full min-h-[380px] flex flex-col bg-card rounded-2xl border border-border overflow-hidden">
        {/* Thumbnail */}
        <div className="relative overflow-hidden shrink-0 h-56">
          {thumbnailUrl ? (
            <Image
              alt={title ?? ""}
              src={thumbnailUrl}
              width={400}
              height={224}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-3">
              <Avatar className="h-14 w-14 rounded-full bg-primary/20 text-primary">
                <AvatarFallback className="text-lg font-semibold">
                  {title?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
          )}

          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90 text-foreground">
              {getLevelText(level)}
            </Badge>
          </div>

          {hasDiscount && originalPrice != null && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-destructive text-destructive-foreground">
                {t("discount")}{" "}
                {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          <h3 className="font-semibold text-base text-foreground line-clamp-2 leading-snug">
            {title}
          </h3>

          {trainers && (
            <p className="text-sm text-muted-foreground">
              {t("trainerLabel")}: {trainers}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm text-muted-foreground">{rating.toFixed(1)}</span>
            </div>
            {salesCount > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{salesCount} {t("studentCount")}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-base font-bold text-foreground">{pricingMain}</span>
            <Badge
              variant={isFree ? "default" : "outline"}
              className={
                isFree
                  ? "bg-green-600 hover:bg-green-600 text-white"
                  : "border-primary text-primary"
              }
            >
              {pricingBadge}
            </Badge>
          </div>
          {hasDiscount && originalPrice != null && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
