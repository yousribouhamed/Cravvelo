"use client";

import Image from "next/image";
import Link from "next/link";
import { Course } from "../types";
import { Rating } from "@smastrom/react-rating";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CourseCard({
  id,
  thumbnailUrl,
  title,
  price,
  rating,
  level,
  trainers,
}: Course) {
  const isFreeCourse = price === 0;
  const formattedPrice = new Intl.NumberFormat("ar-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <Link href={`/courses/${id}`} className="block">
      <div className="group w-full max-w-sm bg-white dark:bg-[#0A0A0C] rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-lg overflow-hidden">
        {/* Thumbnail Section */}
        <div className="relative overflow-hidden">
          {thumbnailUrl ? (
            <Image
              alt={title}
              src={thumbnailUrl}
              width={400}
              height={200}
              className="w-full h-44 object-cover"
            />
          ) : (
            <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
          )}

          {/* Level Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-white/90 text-gray-900 hover:bg-white/90"
            >
              {level}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-2 leading-snug">
            {title}
          </h3>

          {/* Trainers */}
          {trainers && trainers.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {trainers.join(", ")}
            </p>
          )}

          {/* Rating */}
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

          {/* Price and Badge */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {isFreeCourse ? (
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Free
                </span>
              ) : (
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formattedPrice}
                </span>
              )}
            </div>

            {isFreeCourse ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30">
                FREE
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
              >
                PAID
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
