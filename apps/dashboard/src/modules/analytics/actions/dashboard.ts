"use server";

import { withAuth } from "@/src/_internals/with-auth";
import { z } from "zod";

// Helper function to calculate percentage change
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

// Helper function to get previous period dates
function getPreviousPeriodDates(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) {
    // Default to comparing today with yesterday
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
    
    return {
      prevStart: dayBeforeYesterday,
      prevEnd: yesterday,
    };
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationMs = end.getTime() - start.getTime();
  
  const prevEnd = new Date(start.getTime() - 1); // Day before current period
  const prevStart = new Date(prevEnd.getTime() - durationMs);
  
  return { prevStart, prevEnd };
}

export const getMainRevenueData = withAuth({
  input: z
    .object({
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
    })
    .optional(),
  handler: async ({ account, db, input }) => {
    try {
      const { startDate, endDate } = input || {};

      // Build date filter for current period
      const dateFilter: any = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.lte = end;
      }

      // Get previous period dates for comparison
      const { prevStart, prevEnd } = getPreviousPeriodDates(startDate, endDate);

      // Get completed payments for current period
      const payments = await db.payment.findMany({
        where: {
          accountId: account.id,
          status: "COMPLETED",
          type: {
            in: ["BUYPRODUCT", "BUYCOURSE"],
          },
          ...(Object.keys(dateFilter).length > 0 && {
            createdAt: dateFilter,
          }),
        },
        select: {
          id: true,
          amount: true,
          currency: true,
          createdAt: true,
          type: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Get completed payments for previous period
      const previousPayments = await db.payment.findMany({
        where: {
          accountId: account.id,
          status: "COMPLETED",
          type: {
            in: ["BUYPRODUCT", "BUYCOURSE"],
          },
          createdAt: {
            gte: prevStart,
            lte: prevEnd,
          },
        },
        select: {
          id: true,
          amount: true,
        },
      });

      // Get refunds for current period
      const refunds = await db.payment.findMany({
        where: {
          accountId: account.id,
          status: "REFUNDED",
          ...(Object.keys(dateFilter).length > 0 && {
            createdAt: dateFilter,
          }),
        },
        select: {
          id: true,
          amount: true,
        },
      });

      // Get new customers (students) for current period
      const newCustomers = await db.student.count({
        where: {
          accountId: account.id,
          ...(Object.keys(dateFilter).length > 0 && {
            createdAt: dateFilter,
          }),
        },
      });

      // Get new customers for previous period
      const previousNewCustomers = await db.student.count({
        where: {
          accountId: account.id,
          createdAt: {
            gte: prevStart,
            lte: prevEnd,
          },
        },
      });

      // Get wallet data for current balance
      const wallet = await db.wallet.findUnique({
        where: {
          accountId: account.id,
        },
        select: {
          balance: true,
          currency: true,
        },
      });

      // Get website currency settings
      const website = await db.website.findFirst({
        where: {
          accountId: account.id,
        },
        select: {
          currency: true,
          currencySymbol: true,
        },
      });

      // Calculate today's date boundaries
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // Calculate yesterday's date boundaries
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const yesterdayEnd = new Date(yesterday);
      yesterdayEnd.setHours(23, 59, 59, 999);

      // Filter payments for today and yesterday
      const todayPayments = payments.filter(
        (p) => p.createdAt >= today && p.createdAt <= todayEnd
      );
      const yesterdayPayments = payments.filter(
        (p) => p.createdAt >= yesterday && p.createdAt <= yesterdayEnd
      );

      // Calculate revenues
      const todayRevenue = todayPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      const yesterdayRevenue = yesterdayPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      const grossRevenue = payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      // Calculate previous period revenue
      const previousGrossRevenue = previousPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      // Calculate refund totals
      const refundCount = refunds.length;
      const refundAmount = refunds.reduce(
        (sum, refund) => sum + refund.amount,
        0
      );

      // Calculate average order value
      const averageOrderValue = payments.length > 0 
        ? grossRevenue / payments.length 
        : 0;
      const previousAverageOrderValue = previousPayments.length > 0
        ? previousGrossRevenue / previousPayments.length
        : 0;

      // Calculate percentage changes
      const volumeChange = calculatePercentageChange(grossRevenue, previousGrossRevenue);
      const paymentsChange = calculatePercentageChange(payments.length, previousPayments.length);
      const customersChange = calculatePercentageChange(newCustomers, previousNewCustomers);
      const avgOrderChange = calculatePercentageChange(averageOrderValue, previousAverageOrderValue);

      // Helper function to group data by hour
      const groupByHour = (paymentList: typeof payments) => {
        const grouped = new Map<string, number>();
        paymentList.forEach((payment) => {
          const date = new Date(payment.createdAt);
          const hourKey = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours()
          ).toISOString();
          grouped.set(
            hourKey,
            (grouped.get(hourKey) || 0) + payment.amount
          );
        });
        return Array.from(grouped.entries())
          .map(([time, value]) => ({ time, value }))
          .sort((a, b) => a.time.localeCompare(b.time));
      };

      // Helper function to group data by day
      const groupByDay = (paymentList: typeof payments) => {
        const grouped = new Map<string, number>();
        paymentList.forEach((payment) => {
          const date = new Date(payment.createdAt);
          const dayKey = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          ).toISOString();
          grouped.set(dayKey, (grouped.get(dayKey) || 0) + payment.amount);
        });
        return Array.from(grouped.entries())
          .map(([time, value]) => ({ time, value }))
          .sort((a, b) => a.time.localeCompare(b.time));
      };

      // Determine grouping strategy based on date range
      const dateRangeDays = startDate && endDate
        ? Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;

      // Group chart data (by day if range > 7 days, by hour otherwise)
      const chartData =
        dateRangeDays && dateRangeDays > 7
          ? groupByDay(payments)
          : groupByHour(payments);

      // Group today and yesterday data by hour
      const todayData = groupByHour(todayPayments);
      const yesterdayData = groupByHour(yesterdayPayments);

      return {
        success: true,
        data: {
          // Chart data
          chartData,
          todayData,
          yesterdayData,
          
          // Current period metrics
          grossRevenue,
          todayRevenue,
          yesterdayRevenue,
          successfulPayments: payments.length,
          newCustomers,
          averageOrderValue,
          refunds: {
            count: refundCount,
            amount: refundAmount,
          },
          
          // Previous period metrics (for comparison)
          previousPeriod: {
            grossRevenue: previousGrossRevenue,
            successfulPayments: previousPayments.length,
            newCustomers: previousNewCustomers,
            averageOrderValue: previousAverageOrderValue,
          },
          
          // Percentage changes
          changes: {
            volumeChange,
            paymentsChange,
            customersChange,
            avgOrderChange,
          },
          
          // Wallet and currency
          walletBalance: wallet?.balance || 0,
          walletCurrency: website?.currency || wallet?.currency || "DZD",
          currencySymbol: website?.currencySymbol || "DA",
          totalTransactions: payments.length,
        },
      };
    } catch (err) {
      console.error("Error fetching revenue data:", err);
      return {
        success: false,
        error: "Failed to fetch revenue data",
        data: {
          chartData: [],
          todayData: [],
          yesterdayData: [],
          grossRevenue: 0,
          todayRevenue: 0,
          yesterdayRevenue: 0,
          successfulPayments: 0,
          newCustomers: 0,
          averageOrderValue: 0,
          refunds: { count: 0, amount: 0 },
          previousPeriod: {
            grossRevenue: 0,
            successfulPayments: 0,
            newCustomers: 0,
            averageOrderValue: 0,
          },
          changes: {
            volumeChange: 0,
            paymentsChange: 0,
            customersChange: 0,
            avgOrderChange: 0,
          },
          walletBalance: 0,
          walletCurrency: "DZD",
          currencySymbol: "DA",
          totalTransactions: 0,
        },
      };
    }
  },
});
