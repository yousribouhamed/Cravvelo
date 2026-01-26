"use server";

import { withAuth } from "@/src/_internals/with-auth";
import { z } from "zod";

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

      // Build date filter
      const dateFilter: any = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        // Set to end of day
        end.setHours(23, 59, 59, 999);
        dateFilter.lte = end;
      }

      // Get completed payments for revenue calculation
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
          chartData,
          todayData,
          yesterdayData,
          grossRevenue,
          todayRevenue,
          yesterdayRevenue,
          walletBalance: wallet?.balance || 0,
          walletCurrency: wallet?.currency || "DZD",
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
          walletBalance: 0,
          walletCurrency: "DZD",
          totalTransactions: 0,
        },
      };
    }
  },
});
