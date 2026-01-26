"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartConfig, ChartContainer } from "@ui/components/ui/chart";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";
import { trpc } from "@/src/app/_trpc/client";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/src/components/range-date-picker";
import { useSearchParams } from "next/navigation";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#3b82f6",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

interface RevenueChartProps {
  initialData?: {
    chartData: Array<{ time: string; value: number }>;
    todayData: Array<{ time: string; value: number }>;
    yesterdayData: Array<{ time: string; value: number }>;
    grossRevenue: number;
    todayRevenue: number;
    yesterdayRevenue: number;
    walletBalance: number;
    walletCurrency: string;
  };
  currency?: string;
}

export const RevenueChart = ({
  currency: initialCurrency = "DZD",
  initialData,
}: RevenueChartProps) => {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const searchParams = useSearchParams();

  // Read date range from URL params
  const dateRange = useMemo(() => {
    const from = searchParams?.get("from");
    const to = searchParams?.get("to");
    if (from && to) {
      return {
        from: new Date(from),
        to: new Date(to),
      } as DateRange;
    }
    return undefined;
  }, [searchParams]);

  // Prepare query params for tRPC
  const queryParams = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      // Set to start and end of day
      const start = new Date(dateRange.from);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dateRange.to);
      end.setHours(23, 59, 59, 999);
      return {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      };
    }
    return undefined;
  }, [dateRange]);

  // Fetch revenue data via tRPC
  const { data: revenueData, isLoading } = trpc.dashboard.getRevenueData.useQuery(
    queryParams,
    {
      initialData: initialData
        ? {
            success: true,
            data: initialData,
          }
        : undefined,
      refetchOnMount: false,
    }
  );

  // Extract data from response
  const data = revenueData?.success ? revenueData.data : null;
  const currency = data?.walletCurrency || initialCurrency;

  // Helper function to format currency
  const formatCurrency = (amount) => {
    const currencySymbols = {
      USD: t("currency.USD"),
      EUR: t("currency.EUR"),
      DZD: t("currency.DZD"),
    };
    const symbol = currencySymbols[currency] || currency;
    return `${amount.toFixed(2)}${symbol}`;
  };

  // Helper function to safely convert to number
  const toNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Use data from backend or fallback to empty
  const todayData = data?.todayData || [];
  const yesterdayData = data?.yesterdayData || [];
  const allChartData = data?.chartData || [];

  const grossRevenue = data?.grossRevenue || 0;
  const todayRevenue = data?.todayRevenue || 0;
  const yesterdayRevenue = data?.yesterdayRevenue || 0;
  const balance = data?.walletBalance || 0;

  // Get current time for display
  const getCurrentTime = () => {
    const now = new Date();
    const localeString = locale === "ar" ? "ar-DZ" : "en-US";
    return now.toLocaleTimeString(localeString, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(label).toLocaleTimeString(locale === "ar" ? "ar-DZ" : "en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Mini chart component that shows recent trend
  const MiniChart = ({ data, label, showAxes = false }) => {
    return (
      <div className="space-y-2">
        <div className="h-20 rounded-lg overflow-hidden">
          {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
              >
                {showAxes && (
                  <>
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        const localeString = locale === "ar" ? "ar-DZ" : "en-US";
                        return date.toLocaleTimeString(localeString, {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                  </>
                )}
                {!showAxes && (
                  <>
                    <XAxis hide />
                    <YAxis hide />
                  </>
                )}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    fill: "#ffffff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className={cn("flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-xs", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
              {t("noDataAvailable")}
            </div>
          )}
        </div>
        {!showAxes && (
          <div className={cn("flex justify-between text-xs text-gray-400 dark:text-gray-500", isRTL ? "flex-row-reverse" : "")}>
            <span dir={isRTL ? "rtl" : "ltr"}>{getCurrentTime()}</span>
            <span dir={isRTL ? "rtl" : "ltr"}>{getCurrentTime()}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Date Range Picker */}
      <div className={cn("flex", isRTL ? "justify-start" : "justify-end")}>
        <DatePickerWithRange
          dateRange={dateRange}
          className={cn(isRTL ? "mr-auto" : "ml-auto")}
        />
      </div>

      {/* Loading State */}
      {isLoading && !data && (
        <div className={cn("text-center py-8", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
          <p className="text-gray-500 dark:text-gray-400">{t("loading")}</p>
        </div>
      )}

      {/* Today's metrics card */}
      <Card dir={isRTL ? "rtl" : "ltr"}>
        <CardHeader className="pb-4 px-4 sm:px-6">
          <CardTitle className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
            {t("today")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-4 sm:px-6">
          {/* Responsive grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Revenue metrics with charts */}
            <div className="space-y-6">
              <div>
                <p className={cn("text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                  {t("totalRevenue")}
                </p>
                <p className={cn("text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                  {todayRevenue > 0 ? formatCurrency(todayRevenue) : "--"}
                </p>
                <MiniChart data={todayData} label="today" />
              </div>

              <div>
                <p className={cn("text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                  {t("yesterday")}
                </p>
                <p className={cn("text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                  {yesterdayRevenue > 0
                    ? formatCurrency(yesterdayRevenue)
                    : "--"}
                </p>
                <p className={cn("text-xs text-gray-400 dark:text-gray-500 mt-1", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                  {getCurrentTime()}
                </p>
                <div className="mt-4">
                  <MiniChart data={yesterdayData} label="yesterday" />
                </div>
              </div>
            </div>

            {/* Right side - Balance and Payouts */}
            <div className="space-y-6">
              <div>
                <div className={cn("flex items-center mb-2", isRTL ? "flex-row-reverse justify-between" : "justify-between")}>
                  <p className={cn("text-sm text-gray-500 dark:text-gray-400 font-medium", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("balance")}
                  </p>
                  <button className={cn("text-sm font-semibold transition-colors text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("view")}
                  </button>
                </div>
                <p className={cn("text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                  {formatCurrency(balance)}
                </p>
              </div>

              <div>
                <div className={cn("flex items-center mb-2", isRTL ? "flex-row-reverse justify-between" : "justify-between")}>
                  <p className={cn("text-sm text-gray-500 dark:text-gray-400 font-medium", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("payouts")}
                  </p>
                  <button className={cn("text-sm font-semibold transition-colors text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("view")}
                  </button>
                </div>
                <p className={cn("text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                  --
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main comprehensive chart */}
      <Card dir={isRTL ? "rtl" : "ltr"}>
        <CardHeader className="pb-4 px-4 sm:px-6">
          <CardTitle className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
            {t("revenueOverview")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="h-64 sm:h-80 w-full">
            <MiniChart data={allChartData} label="overview" showAxes={true} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
