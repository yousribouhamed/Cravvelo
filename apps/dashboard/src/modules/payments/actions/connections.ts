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
        success: false,
        message: "there is an error",
        data: connections,
      };
    } catch (error) {
      return {
        success: false,
        message: "there is an error",
        data: null,
      };
    }
  },
});
