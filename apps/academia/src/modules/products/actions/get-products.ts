"use server";

import { withTenant } from "@/_internals/with-tenant";
import z from "zod";
import type { ProductWithDefaultPricing, ProductWithPricing } from "../types";

const productListInputSchema = z
  .object({
    search: z.string().optional(),
    sort: z.enum(["newest", "price_asc", "price_desc"]).optional(),
  })
  .optional();

export const getProductsWithDefaultPricing = withTenant({
  input: productListInputSchema,
  handler: async ({ db, accountId, input }) => {
    try {
      const where: {
        accountId: string;
        status: string;
        title?: { contains: string; mode: "insensitive" };
      } = {
        accountId,
        status: "PUBLISHED",
      };
      if (input?.search?.trim()) {
        where.title = {
          contains: input.search.trim(),
          mode: "insensitive",
        };
      }

      const sort = input?.sort ?? "newest";

      const products = await db.product.findMany({
        where,
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

      let result = products as unknown as ProductWithDefaultPricing[];
      if (sort === "price_asc" || sort === "price_desc") {
        const dir = sort === "price_asc" ? 1 : -1;
        result = [...result].sort((a, b) => {
          const priceA =
            a.ProductPricingPlans?.[0]?.PricingPlan?.price ?? Infinity;
          const priceB =
            b.ProductPricingPlans?.[0]?.PricingPlan?.price ?? Infinity;
          return (priceA - priceB) * dir;
        });
      }

      return {
        data: result,
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

