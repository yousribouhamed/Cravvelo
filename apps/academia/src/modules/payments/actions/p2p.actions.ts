"use server";

import { withTenant } from "@/_internals/with-tenant";
import { getCurrentUser } from "@/modules/auth/lib/utils";
import z from "zod";

export const createP2pPaymentIntent = withTenant({
  input: z.object({
    productId: z.string(),
    type: z.enum(["COURSE", "PRODUCT"]),
    notes: z.string().optional(),
    paymentProof: z.string(), // proof URL (screenshot, receipt)
  }),

  handler: async ({ input, db, accountId }) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const { paymentProof, productId, type, notes } = input;

    return await db.$transaction(async (tx) => {
      // 1. Fetch item (course or product) + pricing plan
      let item: any = null;
      let pricingPlan: any = null;

      if (type === "COURSE") {
        item = await tx.course.findUnique({
          where: { id: productId },
          include: { CoursePricingPlans: { include: { PricingPlan: true } } },
        });
        if (!item) throw new Error("Course not found");

        pricingPlan =
          item.CoursePricingPlans.find(
            (p: { isDefault: any }) => p.isDefault
          ) ?? item.CoursePricingPlans[0];
      } else {
        item = await tx.product.findUnique({
          where: { id: productId },
          include: { ProductPricingPlans: { include: { PricingPlan: true } } },
        });
        if (!item) throw new Error("Product not found");

        pricingPlan =
          item.ProductPricingPlans.find(
            (p: { isDefault: any }) => p.isDefault
          ) ?? item.ProductPricingPlans[0];
      }

      if (!pricingPlan?.PricingPlan)
        throw new Error("No active pricing plan found");

      const price = pricingPlan.PricingPlan.price ?? 0;

      // 2. Create Sale
      const sale = await tx.sale.create({
        data: {
          accountId,
          studentId: user.userId,
          amount: price,
          originalAmount: price,
          status: "CREATED",
          itemType: type,
          itemId: item.id,
          price,
          courseId: type === "COURSE" ? item.id : null,
          productId: type === "PRODUCT" ? item.id : null,
          customerNotes: notes ?? null,
        },
      });

      // 3. Create Payment (status PENDING until seller verifies)
      const payment = await tx.payment.create({
        data: {
          type: type === "COURSE" ? "BUYCOURSE" : "BUYPRODUCT",
          amount: price,
          status: "PENDING",
          currency: "DZD",
          method: "BANK_TRANSFER", // or "CASH" depending on how you classify P2P
          studentId: user.userId,
          accountId,
          saleId: sale.id,
          description: `${type} purchase (P2P): ${item.title}`,
          metadata: { method: "P2P" },
        },
      });

      // 4. Store PaymentProof
      await tx.paymentProof.create({
        data: {
          paymentId: payment.id,
          fileUrl: paymentProof,
          note: notes ?? null,
          verified: false,
        },
      });

      return {
        success: true,
        message: "P2P payment intent created. Pending verification.",
        paymentId: payment.id,
        saleId: sale.id,
      };
    });
  },
});
