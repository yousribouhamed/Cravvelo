"use server";

import { withTenant } from "@/_internals/with-tenant";
import { getCurrentUser } from "@/modules/auth/lib/utils";
import z from "zod";
import { PurchaseStatus } from "@prisma/client";
import { getSignedDownloadUrlFromS3Url } from "@/modules/aws/s3";

export const getProductDownloadUrl = withTenant({
  input: z.object({
    productId: z.string(),
  }),
  handler: async ({ db, input }) => {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
        data: null as null | { url: string },
      };
    }

    const purchase = await db.itemPurchase.findFirst({
      where: {
        studentId: user.userId,
        itemType: "PRODUCT",
        itemId: input.productId,
        status: PurchaseStatus.ACTIVE,
        OR: [{ accessEndDate: null }, { accessEndDate: { gte: new Date() } }],
      },
    });

    if (!purchase) {
      const completedPayment = await db.payment.findFirst({
        where: {
          studentId: user.userId,
          status: "COMPLETED",
          Sale: {
            is: {
              itemType: "PRODUCT",
              itemId: input.productId,
              status: "COMPLETED",
            },
          },
        },
        include: {
          Sale: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      if (!completedPayment || !completedPayment.Sale) {
        return {
          success: false,
          message: "Product not owned",
          data: null as null | { url: string },
        };
      }

      const productWithPlan = await db.product.findUnique({
        where: { id: input.productId },
        include: {
          ProductPricingPlans: { include: { PricingPlan: true } },
        },
      });

      const pricingPlan =
        productWithPlan?.ProductPricingPlans?.find((p: any) => p.isDefault) ??
        productWithPlan?.ProductPricingPlans?.[0];
      const plan = pricingPlan?.PricingPlan ?? null;

      if (plan?.id) {
        const accessStartDate = new Date();
        let accessEndDate: Date | null = null;

        if (plan.pricingType === "RECURRING" && plan.recurringDays) {
          accessEndDate = new Date(accessStartDate);
          accessEndDate.setDate(accessEndDate.getDate() + plan.recurringDays);
        } else if (
          plan.pricingType === "ONE_TIME" &&
          plan.accessDuration === "LIMITED" &&
          plan.accessDurationDays
        ) {
          accessEndDate = new Date(accessStartDate);
          accessEndDate.setDate(accessEndDate.getDate() + plan.accessDurationDays);
        }

        await db.itemPurchase.create({
          data: {
            studentId: user.userId,
            accountId: completedPayment.Sale.accountId,
            pricingPlanId: plan.id,
            itemType: "PRODUCT",
            itemId: input.productId,
            purchaseAmount: completedPayment.amount,
            currency: completedPayment.currency || "DZD",
            status: PurchaseStatus.ACTIVE,
            accessStartDate,
            accessEndDate,
            nextBillingDate:
              plan.pricingType === "RECURRING" && plan.recurringDays
                ? (() => {
                    const next = new Date(accessStartDate);
                    next.setDate(next.getDate() + plan.recurringDays);
                    return next;
                  })()
                : null,
          },
        });
      }
    }

    const product = await db.product.findUnique({
      where: { id: input.productId },
      select: { fileUrl: true },
    });

    const fileUrl = product?.fileUrl;
    if (!fileUrl) {
      return {
        success: false,
        message: "No file available for this product",
        data: null as null | { url: string },
      };
    }

    // Prefer secure S3 signed URLs when applicable.
    if (fileUrl.includes(".s3.") && fileUrl.includes("amazonaws.com/")) {
      const signed = await getSignedDownloadUrlFromS3Url(fileUrl, 60);
      if (!signed.success || !signed.url) {
        return {
          success: false,
          message: signed.error || "Failed to generate download URL",
          data: null as null | { url: string },
        };
      }
      return { success: true, message: "ok", data: { url: signed.url } };
    }

    // Fallback: non-S3 URLs are returned as-is.
    return { success: true, message: "ok", data: { url: fileUrl } };
  },
});

