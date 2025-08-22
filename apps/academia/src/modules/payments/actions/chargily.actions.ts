"use server";

import { withTenant } from "@/_internals/with-tenant";
import type { ChargilyApiResponse } from "../types";
import z from "zod";
import { getCurrentUser } from "@/modules/auth/lib/utils";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://pay.chargily.net/test/api/v2/checkouts"
    : "https://pay.chargily.net/api/v2/checkouts";

export const createChargilyCheckout = withTenant({
  input: z.object({
    totalPrice: z.string(),
    paymentId: z.string(),
  }),
  handler: async ({ tenant, input }) => {
    try {
      const amount = Math.round(Number(input.totalPrice) * 1); // convert DZD → centimes
      const payload = {
        amount,
        currency: "dzd",
        payment_method: "EDAHABIA",
        success_url: `https://${tenant}.cravvelo.com/payments/success`,
        failure_url: `https://${tenant}.cravvelo.com/payments/failure`,
        webhook_endpoint: `https://${tenant}.cravvelo.com/api/webhooks/chargily`,
        metadata: [{ paymentId: input.paymentId }],
        description: `Payment for order ${input.paymentId}`,
        locale: "ar",
      };

      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(
          `Chargily API error: ${response.status} ${response.statusText} - ${errText}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        message: "Checkout created successfully",
        data: data as ChargilyApiResponse,
      };
    } catch (error) {
      console.error("Failed to create Chargily checkout:", error);
      return {
        success: false,
        message: "Failed to create checkout",
        data: null,
      };
    }
  },
});

export const createChargilyPaymentIntent = withTenant({
  input: z.object({
    productId: z.string(),
    type: z.enum(["COURSE", "PRODUCT"]),
  }),

  handler: async ({ accountId, tenant, input, db }) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    return await db.$transaction(async (tx) => {
      // 1. Fetch the item (course or product)
      let item: any = null;
      let pricingPlan: any = null;

      if (input.type === "COURSE") {
        item = await tx.course.findUnique({
          where: { id: input.productId },
          include: { CoursePricingPlans: { include: { PricingPlan: true } } },
        });
        if (!item) throw new Error("Course not found");

        pricingPlan =
          item.CoursePricingPlans.find(
            (p: { isDefault: any }) => p.isDefault
          ) ?? item.CoursePricingPlans[0];
      } else {
        item = await tx.product.findUnique({
          where: { id: input.productId },
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
          itemType: input.type,
          itemId: item.id,
          price,
          courseId: input.type === "COURSE" ? item.id : null,
          productId: input.type === "PRODUCT" ? item.id : null,
        },
      });

      // 3. Create Payment (status PENDING)
      const payment = await tx.payment.create({
        data: {
          type: input.type === "COURSE" ? "BUYCOURSE" : "BUYPRODUCT",
          amount: price,
          status: "PENDING",
          currency: "DZD",
          method: "CHARGILY",
          studentId: user.userId,
          accountId,
          saleId: sale.id,
          description: `${input.type} purchase: ${item.title}`,
        },
      });

      const checkout = await createChargilyCheckout({
        totalPrice: price.toString(),
        paymentId: payment.id,
      });

      if (!checkout.data?.checkout_url)
        throw new Error("Failed to create Chargily checkout");

      return {
        success: true,
        checkoutUrl: checkout.data?.checkout_url,
        paymentId: payment.id,
        saleId: sale.id,
      };
    });
  },
});
