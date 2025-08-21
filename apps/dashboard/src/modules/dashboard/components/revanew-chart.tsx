"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

export const RevenueChart = ({ initialData = [], currency = "DZD" }) => {
  // Helper function to format currency
  const formatCurrency = (amount) => {
    const currencySymbols = {
      USD: "$",
      EUR: "€",
      DZD: "د.ج",
    };
    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${amount.toFixed(2)}`;
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

  // Filter and compute values with safe number conversion
  const todayData = initialData.filter((item) => item.time.startsWith(today));
  const yesterdayData = initialData.filter((item) =>
    item.time.startsWith(yesterdayStr)
  );

  const grossRevenue = todayData.reduce(
    (sum, item) => sum + toNumber(item.value),
    0
  );
  const yesterdayRevenue = yesterdayData.reduce(
    (sum, item) => sum + toNumber(item.value),
    0
  );
  const balance = initialData.reduce(
    (sum, item) => sum + toNumber(item.value),
    0
  );

  // Create comprehensive chart data - this is the key fix
  const allChartData = [...initialData]
    .map((item) => ({ ...item, value: toNumber(item.value) }))
    .sort((a, b) => new Date(a.time) - new Date(b.time));

  // Get current time for display
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("ar-DZ", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Mini chart component that shows recent trend
  const MiniChart = ({ data, label, showAxes = false }) => {
    return (
      <div className="space-y-2">
        <div className="h-52 rounded border bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
          {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 12, right: 12, left: 12, bottom: 12 }}
              >
                {showAxes && (
                  <>
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#6b7280" }}
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
                      tick={{ fontSize: 10, fill: "#6b7280" }}
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
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 4,
                    stroke: "#f97316",
                    strokeWidth: 2,
                    fill: "#ffffff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600 dark:text-gray-400 text-xs">
              لا توجد بيانات متاحة
            </div>
          )}
        </div>
        {!showAxes && (
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>12:00 ص</span>
            <span>12:00 ص</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Today's metrics card */}
      <Card className="w-full border" dir="rtl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
            اليوم
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Top metrics row */}
          <div className="grid grid-cols-2 gap-8">
            {/* Left side - Revenue metrics with charts */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                  إجمالي الإيرادات
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {grossRevenue > 0 ? formatCurrency(grossRevenue) : "--"}
                </p>
                <MiniChart
                  data={
                    todayData.length > 0 ? todayData : allChartData.slice(-5)
                  }
                  label="today"
                />
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                  أمس
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {yesterdayRevenue > 0
                    ? formatCurrency(yesterdayRevenue)
                    : "--"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {getCurrentTime()}
                </p>
                <div className="mt-4">
                  <MiniChart
                    data={
                      yesterdayData.length > 0
                        ? yesterdayData
                        : allChartData.slice(-3)
                    }
                    label="yesterday"
                  />
                </div>
              </div>
            </div>

            {/* Right side - Balance and Payouts */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    الرصيد
                  </p>
                  <button className="text-sm font-medium transition-colors text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    عرض
                  </button>
                </div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {formatCurrency(balance)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatCurrency(balance)} متاح للسحب
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    المدفوعات
                  </p>
                  <button className="text-sm font-medium transition-colors text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    عرض
                  </button>
                </div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  --
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Main comprehensive chart */}
      <Card className="w-full border" dir="rtl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
            نظرة عامة على الإيرادات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <MiniChart data={allChartData} label="overview" showAxes={true} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
