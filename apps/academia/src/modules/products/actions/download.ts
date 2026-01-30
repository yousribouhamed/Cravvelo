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
      return {
        success: false,
        message: "Product not owned",
        data: null as null | { url: string },
      };
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

