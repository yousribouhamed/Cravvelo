"use client";

import React from "react";
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

export const RevenueChart = ({ currency = "DZD" }) => {
  // Helper function to format currency
  const formatCurrency = (amount) => {
    const currencySymbols = {
      USD: "$",
      EUR: "€",
      DZD: "د.ج",
    };
    const symbol = currencySymbols[currency] || currency;
    return `${amount.toFixed(2)}${symbol}`;
  };

  // Helper function to safely convert to number
  const toNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Get yesterday's date in YYYY-MM-DD format
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  // Empty data arrays since we removed initialData
  const todayData = [];
  const yesterdayData = [];
  const allChartData = [];

  const grossRevenue = 0;
  const yesterdayRevenue = 0;
  const balance = 0;

  // Get current time for display
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("ar-DZ", {
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
            {new Date(label).toLocaleTimeString([], {
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
                        return date.toLocaleTimeString([], {
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
            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-xs">
              لا توجد بيانات متاحة
            </div>
          )}
        </div>
        {!showAxes && (
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>12:00 ص</span>
            <span>12:00 ص</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Today's metrics card */}
      <Card dir="rtl">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            اليوم
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-4 sm:px-6">
          {/* Responsive grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Revenue metrics with charts */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  إجمالي الإيرادات
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {grossRevenue > 0 ? formatCurrency(grossRevenue) : "--"}
                </p>
                <MiniChart data={todayData} label="today" />
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  أمس
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {yesterdayRevenue > 0
                    ? formatCurrency(yesterdayRevenue)
                    : "--"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
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
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    الرصيد
                  </p>
                  <button className="text-sm font-semibold transition-colors text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    عرض
                  </button>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {formatCurrency(balance)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {formatCurrency(balance)} متاح للسحب
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    المدفوعات
                  </p>
                  <button className="text-sm font-semibold transition-colors text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    عرض
                  </button>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  --
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main comprehensive chart */}
      <Card dir="rtl">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            نظرة عامة على الإيرادات
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
