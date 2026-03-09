"use client";

import { ColumnDef } from "@tanstack/react-table";
import BrandButton from "@/components/brand-button";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { BookOpen, Calendar, Play } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export type CourseSale = {
  id: string;
  orderNumber: number;
  amount: number;
  status: string;
  createdAt: Date | string;
  Course: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
  } | null;
};

export function useCourseColumns(): ColumnDef<CourseSale>[] {
  const t = useTranslations("profile.courses");
  const locale = useLocale();

  const dateLocale = locale === "ar" ? "ar-DZ" : "en-US";

  return useMemo(() => {
    const formatAmount = (amount: number) => {
      const formatted = new Intl.NumberFormat(dateLocale).format(amount);
      return `${formatted} ${t("currency")}`;
    };

    const formatDate = (rawDate: Date | string) => {
      const d = new Date(rawDate);
      if (Number.isNaN(d.getTime())) return String(rawDate);

      return {
        date: d.toLocaleDateString(dateLocale, {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        weekday: d.toLocaleDateString(dateLocale, { weekday: "short" }),
      };
    };

    return [
      {
        accessorKey: "Course.title",
        header: () => (
          <div className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-4 w-4" />
            {t("columns.courseName")}
          </div>
        ),
        cell: ({ row }) => {
          const course = row.original.Course;
          const thumbnailUrl = course?.thumbnailUrl;

          if (!course) {
            return (
              <span className="text-gray-400 text-sm">
                {t("courseNotFound")}
              </span>
            );
          }

          return (
            <div className="flex items-center gap-3">
              {thumbnailUrl && (
                <div className="relative h-12 w-12 rounded-lg overflow-hidden border">
                  <Image
                    src={thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {course.title}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: () => (
          <div className="font-semibold">{t("columns.amount")}</div>
        ),
        cell: ({ row }) => {
          const amountRaw = row.getValue("amount");
          const amount = typeof amountRaw === "number" ? amountRaw : Number(amountRaw);
          return <span className="font-medium">{formatAmount(amount)}</span>;
        },
      },
      {
        accessorKey: "createdAt",
        header: () => (
          <div className="flex items-center gap-2 font-semibold">
            <Calendar className="h-4 w-4" />
            {t("columns.purchaseDate")}
          </div>
        ),
        cell: ({ row }) => {
          const rawDate = row.getValue("createdAt") as Date | string;
          const formatted = formatDate(rawDate);

          if (typeof formatted === "string") {
            return <span className="text-sm font-medium">{formatted}</span>;
          }

          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{formatted.date}</span>
              <span className="text-xs text-gray-500">{formatted.weekday}</span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => (
          <div className="font-semibold">{t("columns.actions")}</div>
        ),
        cell: ({ row }) => {
          const courseId = row.original.Course?.id;
          if (!courseId) return <span className="text-gray-400 text-sm">—</span>;

          return (
            <BrandButton size="sm" className="gap-1.5" asChild>
              <Link href={`/courses/${courseId}/watch`}>
                <Play className="h-3.5 w-3.5" />
                {t("actions.watch")}
              </Link>
            </BrandButton>
          );
        },
      },
    ] satisfies ColumnDef<CourseSale>[];
  }, [dateLocale, t]);
}
