"use client";
import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Star } from "lucide-react";

interface WebsiteCardProps {
  name: string;
  logo: string;
  description: string;
  revenue: number;
  rating: number;
  chartData: Array<{ value: number }>;
}

export default function WebsiteCard({
  name,
  logo,
  description,
  revenue = 0,
  rating = 0,
  chartData = [],
}: WebsiteCardProps) {
  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M DZD`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K DZD`;
    }
    return `${amount} DZD`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star size={16} className="text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white dark:bg-muted border rounded-xl p-6 shadow-sm hover:shadow-md dark:hover:shadow-zinc-900/20 transition-shadow duration-200 max-w-md">
      <div className="w-full grid grid-cols-3 gap-4 mb-4">
        {/* Logo and Name */}
        <div className="col-span-2 flex items-start gap-3">
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt={`${name} logo`}
              className="w-10 h-10 rounded-lg object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLDivElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div
              className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm hidden"
              style={{ display: "none" }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-lg truncate">
              {name}
            </h3>
          </div>
        </div>

        {/* Revenue */}
        <div className="text-right">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Revenue
          </div>
          <div className="font-bold text-green-600 dark:text-green-500 text-lg">
            {formatRevenue(revenue)}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-zinc-600 dark:text-zinc-300 text-sm mb-4 line-clamp-2 leading-relaxed">
        {description}
      </p>

      {/* Chart */}
      <div className="mb-4 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">{renderStars(rating)}</div>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {rating}
          </span>
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          Based on reviews
        </div>
      </div>
    </div>
  );
}
