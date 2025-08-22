"use server";

import { withTenant } from "@/_internals/with-tenant";

export const getTenantPaymentConnections = withTenant({
  handler: async ({ accountId, db }) => {
    try {
      const connections = await db.paymentMethodConfig.findMany({
        where: {
          accountId,
        },
        select: {
          config: true,
          provider: true,
          isActive: true,
        },
      });

      return {
        data: connections,
        success: true,
        message: "we got the connections",
      };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        success: false,
        message: error,
      };
    }
  },
});
