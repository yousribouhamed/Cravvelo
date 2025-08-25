"use server";

import { withAuth } from "@/src/_internals/with-auth";

export const getMainRevenueData = withAuth({
  handler: async ({ account, db }) => {
    try {
      // Get completed payments for revenue calculation
      const payments = await db.payment.findMany({
        where: {
          accountId: account.id,
          status: "COMPLETED",
          type: {
            in: ["BUYPRODUCT", "BUYCOURSE"],
          },
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

      // Format data for chart (time series with ISO string timestamps)
      const chartData = payments.map((payment) => ({
        time: payment.createdAt.toISOString(),
        value: payment.amount,
        type: payment.type,
        currency: payment.currency,
      }));

      return {
        success: true,
        data: {
          chartData,
          walletBalance: wallet?.balance || 0,
          walletCurrency: wallet?.currency || "DZD",
          totalRevenue: payments.reduce(
            (sum, payment) => sum + payment.amount,
            0
          ),
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
          walletBalance: 0,
          walletCurrency: "DZD",
          totalRevenue: 0,
          totalTransactions: 0,
        },
      };
    }
  },
});
