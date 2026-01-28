"use server";

import { withTenant } from "@/_internals/with-tenant";
import { getCurrentUser } from "@/modules/auth/lib/utils";

export const getStudentProducts = withTenant({
  handler: async ({ db }) => {
    try {
      const user = await getCurrentUser();

      const sales = await db.sale.findMany({
        where: {
          studentId: user?.userId,
          itemType: "PRODUCT",
        },
        include: {
          Product: {
            select: {
              id: true,
              title: true,
              thumbnailUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        data: sales,
        message: "Successfully fetched student products",
        success: true,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        message: "Failed to fetch student products",
        success: false,
      };
    }
  },
});
