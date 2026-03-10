"use client";

import { cn } from "@ui/lib/utils";
import { Card, CardContent } from "@ui/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  sparklineData?: Array<{ value: number }>;
  isRTL?: boolean;
  className?: string;
  valueClassName?: string;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  sparklineData,
  isRTL = false,
  className,
  valueClassName,
  isLoading = false,
}: StatsCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === undefined || change === 0;

  const changeColor = isPositive
    ? "text-green-600 dark:text-green-400"
    : isNegative
    ? "text-red-600 dark:text-red-400"
    : "text-muted-foreground";

  const changeBgColor = isPositive
    ? "bg-green-50 dark:bg-green-900/20"
    : isNegative
    ? "bg-red-50 dark:bg-red-900/20"
    : "bg-gray-50 dark:bg-muted";

  const ChangeIcon = isPositive
    ? ArrowUpRight
    : isNegative
    ? ArrowDownRight
    : Minus;

  const sparklineColor = isPositive ? "#22c55e" : isNegative ? "#ef4444" : "#6b7280";

  if (isLoading) {
    return (
      <Card className={cn("border border-gray-200 dark:border-border bg-card", className)}>
        <CardContent className="p-4 sm:p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-24 bg-gray-200 dark:bg-muted rounded" />
            <div className="h-8 w-32 bg-gray-200 dark:bg-muted rounded" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "border border-gray-200 dark:border-border bg-card hover:shadow-md transition-shadow",
        className
      )}
    >
      <CardContent className="p-4 sm:p-6">
        <div className={cn("flex flex-col gap-2", isRTL && "text-right")}>
          {/* Header with title and icon */}
          <div
            className={cn(
              "flex items-center gap-2",
              isRTL ? "flex-row-reverse justify-end" : "justify-start"
            )}
          >
            {icon && (
              <div className="text-muted-foreground">{icon}</div>
            )}
            <span className="text-sm font-medium text-muted-foreground">
              {title}
            </span>
          </div>

          {/* Value */}
          <div
            className={cn(
              "text-2xl sm:text-3xl font-bold text-foreground",
              valueClassName
            )}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {value}
          </div>

          {/* Change indicator and sparkline row */}
          <div
            className={cn(
              "flex items-center gap-3 mt-1",
              isRTL ? "flex-row-reverse justify-end" : "justify-start"
            )}
          >
            {/* Change badge */}
            {change !== undefined && (
              <div
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                  changeBgColor,
                  changeColor
                )}
              >
                <ChangeIcon className="h-3 w-3" />
                <span>
                  {isNeutral ? "0" : isPositive ? `+${change}` : change}%
                </span>
              </div>
            )}

            {/* Change label */}
            {changeLabel && (
              <span className="text-xs text-muted-foreground">
                {changeLabel}
              </span>
            )}

            {/* Sparkline */}
            {sparklineData && sparklineData.length > 1 && (
              <div className="h-8 w-16 ml-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={sparklineColor}
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Grid wrapper for stats cards
interface StatsGridProps {
  children: React.ReactNode;
  className?: string;
}

export function StatsGrid({ children, className }: StatsGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full min-w-0",
        className
      )}
    >
      {children}
    </div>
  );
}
