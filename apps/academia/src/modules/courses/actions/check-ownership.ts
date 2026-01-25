"use server";

import { withTenant } from "@/_internals/with-tenant";
import { getCurrentUser } from "@/modules/auth/lib/utils";
import z from "zod";
import { PurchaseStatus } from "@prisma/client";

export const checkCourseOwnership = withTenant({
  input: z.object({
    courseId: z.string(),
  }),
  handler: async ({ db, input }) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return {
          data: false,
          success: true,
          message: "User not authenticated",
        };
      }

      // Check if student has an active ItemPurchase for this course
      const itemPurchase = await db.itemPurchase.findFirst({
        where: {
          studentId: user.userId,
          itemType: "COURSE",
          itemId: input.courseId,
          status: PurchaseStatus.ACTIVE,
          OR: [
            { accessEndDate: null }, // Unlimited access
            { accessEndDate: { gte: new Date() } }, // Access not expired
          ],
        },
      });

      return {
        data: !!itemPurchase,
        success: true,
        message: itemPurchase ? "Course is owned" : "Course is not owned",
      };
    } catch (error) {
      console.error("Error checking course ownership:", error);
      return {
        data: false,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while checking ownership",
      };
    }
  },
});
