"use client";

import React, { useMemo } from "react";
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
  AreaChart,
  Area,
} from "recharts";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";
import { trpc } from "@/src/app/_trpc/client";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/src/components/range-date-picker";
import { useSearchParams } from "next/navigation";
import { useCurrency } from "@/src/hooks/use-currency";
import { StatsCard, StatsGrid } from "@/src/components/stats-card";
import { 
  DollarSign, 
  CreditCard, 
  Users, 
  ShoppingCart,
  RefreshCcw
} from "lucide-react";

interface RevenueChartProps {
  initialData?: {
    chartData: Array<{ time: string; value: number }>;
    todayData: Array<{ time: string; value: number }>;
    yesterdayData: Array<{ time: string; value: number }>;
    grossRevenue: number;
    todayRevenue: number;
    yesterdayRevenue: number;
    successfulPayments: number;
    newCustomers: number;
    averageOrderValue: number;
    refunds: { count: number; amount: number };
    previousPeriod: {
      grossRevenue: number;
      successfulPayments: number;
      newCustomers: number;
      averageOrderValue: number;
    };
    changes: {
      volumeChange: number;
      paymentsChange: number;
      customersChange: number;
      avgOrderChange: number;
    };
    walletBalance: number;
    walletCurrency: string;
    currencySymbol: string;
  };
}

export const RevenueChart = ({ initialData }: RevenueChartProps) => {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const searchParams = useSearchParams();
  const { formatPrice, currencySymbol, isLoading: currencyLoading } = useCurrency();

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
      staleTime: 1000 * 60 * 2, // Cache for 2 minutes
    }
  );

  // Extract data from response
  const data = revenueData?.success ? revenueData.data : null;

  // Use data from backend or fallback to empty
  const todayData = data?.todayData || [];
  const yesterdayData = data?.yesterdayData || [];
  const allChartData = data?.chartData || [];

  const grossRevenue = data?.grossRevenue || 0;
  const todayRevenue = data?.todayRevenue || 0;
  const yesterdayRevenue = data?.yesterdayRevenue || 0;
  const balance = data?.walletBalance || 0;
  
  // New metrics
  const successfulPayments = data?.successfulPayments || 0;
  const newCustomers = data?.newCustomers || 0;
  const averageOrderValue = data?.averageOrderValue || 0;
  const refunds = data?.refunds || { count: 0, amount: 0 };
  const changes = data?.changes || {
    volumeChange: 0,
    paymentsChange: 0,
    customersChange: 0,
    avgOrderChange: 0,
  };

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

  // Custom tooltip component for chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-card p-3 rounded-lg shadow-lg border border-gray-200 dark:border-border">
          <p className="text-sm text-gray-600 dark:text-muted-foreground">
            {new Date(label).toLocaleDateString(locale === "ar" ? "ar-DZ" : "en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Sparkline data for stats cards
  const revenueSparkline = allChartData.map(d => ({ value: d.value }));

  return (
    <div className="space-y-6 max-w-full">
      {/* Date Range Picker with Presets */}
      <div className={cn("flex flex-wrap items-center gap-4", isRTL ? "flex-row-reverse" : "")}>
        <DatePickerWithRange
          dateRange={dateRange}
          showPresets={true}
        />
      </div>

      {/* Balance Card - at the top */}
      <Card className="border border-gray-200 dark:border-border bg-card" dir={isRTL ? "rtl" : "ltr"}>
        <CardContent className="p-4 sm:p-6">
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <div className={cn(isRTL && "text-right")}>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {t("balance")}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {formatPrice(balance)}
              </p>
            </div>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              {t("view")}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {(isLoading || currencyLoading) && !data && (
        <StatsGrid>
          <StatsCard title="" value="" isLoading={true} />
          <StatsCard title="" value="" isLoading={true} />
          <StatsCard title="" value="" isLoading={true} />
          <StatsCard title="" value="" isLoading={true} />
        </StatsGrid>
      )}

      {/* Stats Cards Row - Stripe-like metrics */}
      {data && (
        <StatsGrid>
          <StatsCard
            title={t("grossVolume")}
            value={formatPrice(grossRevenue)}
            change={changes.volumeChange}
            changeLabel={t("comparedTo")}
            icon={<DollarSign className="h-4 w-4" />}
            sparklineData={revenueSparkline}
            isRTL={isRTL}
          />
          <StatsCard
            title={t("successfulPayments")}
            value={successfulPayments.toLocaleString()}
            change={changes.paymentsChange}
            changeLabel={t("comparedTo")}
            icon={<CreditCard className="h-4 w-4" />}
            isRTL={isRTL}
          />
          <StatsCard
            title={t("newCustomers")}
            value={newCustomers.toLocaleString()}
            change={changes.customersChange}
            changeLabel={t("comparedTo")}
            icon={<Users className="h-4 w-4" />}
            isRTL={isRTL}
          />
          <StatsCard
            title={t("averageOrder")}
            value={formatPrice(averageOrderValue)}
            change={changes.avgOrderChange}
            changeLabel={t("comparedTo")}
            icon={<ShoppingCart className="h-4 w-4" />}
            isRTL={isRTL}
          />
        </StatsGrid>
      )}

      {/* Refunds card (if any) */}
      {data && refunds.count > 0 && (
        <Card className="border border-gray-200 dark:border-border bg-card">
          <CardContent className="p-4 sm:p-6">
            <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
              <div className="p-2 rounded-full bg-red-50 dark:bg-red-900/20">
                <RefreshCcw className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className={cn(isRTL && "text-right")}>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("refunds")}
                </p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {refunds.count} ({formatPrice(refunds.amount)})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Revenue Chart */}
      <Card className="border border-gray-200 dark:border-border" dir={isRTL ? "rtl" : "ltr"}>
        <CardHeader className="pb-4 px-4 sm:px-6">
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <CardTitle className={cn("text-lg font-semibold text-foreground", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
              {t("revenueOverview")}
            </CardTitle>
            <div className={cn("text-2xl font-bold text-foreground", isRTL ? "text-left" : "text-right")}>
              {formatPrice(grossRevenue)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <div className="h-64 sm:h-80 w-full">
            {allChartData && allChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={allChartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString(locale === "ar" ? "ar-DZ" : "en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                      return value.toString();
                    }}
                    dx={-10}
                    width={50}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    activeDot={{
                      r: 6,
                      stroke: "#3b82f6",
                      strokeWidth: 2,
                      fill: "#ffffff",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className={cn("flex items-center justify-center h-full text-muted-foreground", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                {t("noDataAvailable")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Today vs Yesterday Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Revenue */}
        <Card className="border border-gray-200 dark:border-border" dir={isRTL ? "rtl" : "ltr"}>
          <CardHeader className="pb-2 px-4 sm:px-6">
            <CardTitle className={cn("text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
              {t("today")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4">
            <p className={cn("text-2xl sm:text-3xl font-bold text-foreground mb-4", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
              {todayRevenue > 0 ? formatPrice(todayRevenue) : "--"}
            </p>
            <div className="h-16">
              {todayData && todayData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={todayData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                  {t("noDataAvailable")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Yesterday's Revenue */}
        <Card className="border border-gray-200 dark:border-border" dir={isRTL ? "rtl" : "ltr"}>
          <CardHeader className="pb-2 px-4 sm:px-6">
            <CardTitle className={cn("text-sm font-medium text-muted-foreground", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
              {t("yesterday")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4">
            <p className={cn("text-2xl sm:text-3xl font-bold text-foreground mb-4", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
              {yesterdayRevenue > 0 ? formatPrice(yesterdayRevenue) : "--"}
            </p>
            <div className="h-16">
              {yesterdayData && yesterdayData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yesterdayData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#6b7280"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                  {t("noDataAvailable")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
