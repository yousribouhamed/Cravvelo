"use server";

import { withTenant } from "@/_internals/with-tenant";
import { getCurrentUser } from "@/modules/auth/lib/utils";

export const getStudentCourses = withTenant({
  handler: async ({ db }) => {
    try {
      const user = await getCurrentUser();

      const sales = await db.sale.findMany({
        where: {
          studentId: user?.userId,
          itemType: "COURSE",
        },
        include: {
          Course: {
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
        message: "Successfully fetched student courses",
        success: true,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        message: "Failed to fetch student courses",
        success: false,
      };
    }
  },
});
