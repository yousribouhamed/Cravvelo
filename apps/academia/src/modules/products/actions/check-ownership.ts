"use server";

import { withTenant } from "@/_internals/with-tenant";
import { getCurrentUser } from "@/modules/auth/lib/utils";
import z from "zod";
import { PurchaseStatus } from "@prisma/client";

export const checkProductOwnership = withTenant({
  input: z.object({
    productId: z.string(),
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

      const itemPurchase = await db.itemPurchase.findFirst({
        where: {
          studentId: user.userId,
          itemType: "PRODUCT",
          itemId: input.productId,
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
        message: itemPurchase ? "Product is owned" : "Product is not owned",
      };
    } catch (error) {
      console.error("Error checking product ownership:", error);
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

