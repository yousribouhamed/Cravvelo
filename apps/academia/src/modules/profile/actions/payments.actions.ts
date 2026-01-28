"use server";

import { withTenant } from "@/_internals/with-tenant";
import { getCurrentUser } from "@/modules/auth/lib/utils";

export const getStudentPayments = withTenant({
  handler: async ({ db }) => {
    try {
      const user = await getCurrentUser();

      const payments = await db.payment.findMany({
        where: {
          studentId: user?.userId,
        },
        include: {
          Sale: {
            include: {
              Course: {
                select: {
                  id: true,
                  title: true,
                  thumbnailUrl: true,
                },
              },
              Product: {
                select: {
                  id: true,
                  title: true,
                  thumbnailUrl: true,
                },
              },
            },
          },
          Proofs: {
            select: {
              id: true,
              fileUrl: true,
              verified: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        data: payments,
        message: "Successfully fetched student payments",
        success: true,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        message: "Failed to fetch student payments",
        success: false,
      };
    }
  },
});
