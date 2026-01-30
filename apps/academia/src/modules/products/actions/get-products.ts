"use server";

import { withTenant } from "@/_internals/with-tenant";
import z from "zod";
import type { ProductWithDefaultPricing, ProductWithPricing } from "../types";

export const getProductsWithDefaultPricing = withTenant({
  handler: async ({ db, accountId }) => {
    try {
      const products = await db.product.findMany({
        where: {
          accountId,
          status: "PUBLISHED"
         
        },
        include: {
          ProductPricingPlans: {
            where: { isDefault: true },
            include: {
              PricingPlan: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  pricingType: true,
                  price: true,
                  compareAtPrice: true,
                  currency: true,
                  accessDuration: true,
                  accessDurationDays: true,
                  recurringDays: true,
                },
              },
            },
          },
          _count: {
            select: { Sale: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return {
        data: products as unknown as ProductWithDefaultPricing[],
        success: true,
        message: "Products with default pricing retrieved successfully",
      };
    } catch (error) {
      console.error("products with default pricing get error:", error);
      return {
        data: null,
        success: false,
        message: error as string,
      };
    }
  },
});

export const getProductById = withTenant({
  input: z.object({
    productId: z.string(),
  }),
  handler: async ({ db, accountId, input }) => {
    try {
      const product = await db.product.findFirst({
        where: {
          id: input.productId,
          accountId,
          status: "PUBLISHED",
          isVisible: true,
        },
        include: {
          ProductPricingPlans: {
            include: {
              PricingPlan: true,
            },
            orderBy: {
              isDefault: "desc",
            },
          },
          _count: {
            select: { Sale: true },
          },
        },
      });

      if (!product) {
        return {
          data: null,
          success: false,
          message: "Product not found",
        };
      }

      return {
        data: product as unknown as ProductWithPricing,
        success: true,
        message: "success",
      };
    } catch (error) {
      console.error("product get error:", error);
      return {
        data: null,
        success: false,
        message: error as string,
      };
    }
  },
});

