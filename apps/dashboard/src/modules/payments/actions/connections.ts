"use server";

import { withAuth } from "@/src/_internals/with-auth";

export const getConnections = withAuth({
  handler: async ({ db, account }) => {
    try {
      const data = await db.paymentMethodConfig.findMany({
        where: {
          accountId: account.id,
        },
      });

      const connections = data.map((item) => {
        return {
          provider: item.provider,
          isConnected: item.isActive,
        };
      });

      return {
        success: true,
        message: "Connections retrieved successfully",
        data: connections,
      };
    } catch (error) {
      console.error("Error fetching payment connections:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to retrieve connections",
        data: [],
      };
    }
  },
});
