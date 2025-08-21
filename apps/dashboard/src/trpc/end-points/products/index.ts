import { privateProcedure } from "../../trpc";
import { z } from "zod";
import { prisma } from "database/src";
import { TRPCError } from "@trpc/server";

const getAccount = async ({ userId }: { userId: string }) => {
  const data = await prisma.account.findUnique({
    where: {
      userId,
    },
  });

  return data;
};

export const products = {
  getProducts: privateProcedure.query(async ({ ctx }) => {
    try {
      const account = await getAccount({ userId: ctx.user.id });
      const products = ctx.prisma.product.findMany({
        where: {
          accountId: account.id,
        },
      });

      return products;
    } catch (err) {
      console.error(err);
    }
  }),
  createProduct: privateProcedure
    .input(
      z.object({
        productName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = await getAccount({ userId: ctx.user.id });
        const product = await ctx.prisma.product.create({
          data: {
            title: input.productName,
            accountId: account.id,
          },
        });

        return product;
      } catch (err) {
        console.error(err);
      }
    }),

  deleteProduct: privateProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const product = await ctx.prisma.product.delete({
          where: {
            id: input.productId,
          },
        });

        return product;
      } catch (err) {
        console.error(err);
      }
    }),

  priceProduct: privateProcedure
    .input(
      z.object({
        productId: z.string(),
        pricingType: z.enum(["FREE", "ONE_TIME", "RECURRING"]),
        price: z.number().optional(),
        compareAtPrice: z.number().optional(),
        accessDuration: z.enum(["LIMITED", "UNLIMITED"]).optional(),
        accessDurationDays: z.number().optional(),
        recurringDays: z.number().optional(), // Changed from recurringInterval to recurringDays
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await ctx.prisma.$transaction(async (tx) => {
          // 1. Check if the product already has a pricing plan
          const existingProductPricing = await tx.productPricingPlan.findFirst({
            where: {
              productId: input.productId,
            },
            include: {
              PricingPlan: true,
            },
          });

          let pricingPlan;

          if (existingProductPricing) {
            // Update existing pricing plan
            pricingPlan = await tx.pricing.update({
              where: {
                id: existingProductPricing.pricingPlanId,
              },
              data: {
                name: `${
                  input.pricingType === "FREE"
                    ? "Free Access"
                    : input.pricingType === "ONE_TIME"
                    ? "One-time Purchase"
                    : "Recurring Subscription"
                }`,
                pricingType: input.pricingType,
                price: input.pricingType === "FREE" ? 0 : input.price,
                // Added compareAtPrice support
                compareAtPrice:
                  input.pricingType === "FREE" ? 0 : input.compareAtPrice,
                accessDuration:
                  input.pricingType === "ONE_TIME"
                    ? input.accessDuration
                    : null,
                accessDurationDays:
                  input.pricingType === "ONE_TIME" &&
                  input.accessDuration === "LIMITED"
                    ? input.accessDurationDays
                    : null,
                // Changed from recurringInterval
                recurringDays:
                  input.pricingType === "RECURRING"
                    ? input.recurringDays
                    : null,
              },
            });
          } else {
            // Create new pricing plan
            pricingPlan = await tx.pricing.create({
              data: {
                accountId: ctx.user.id, // assuming ctx.user.id is the account ID
                name: `${
                  input.pricingType === "FREE"
                    ? "Free Access"
                    : input.pricingType === "ONE_TIME"
                    ? "One-time Purchase"
                    : "Recurring Subscription"
                }`,
                description: `Pricing plan for product access`,
                pricingType: input.pricingType,
                price: input.pricingType === "FREE" ? 0 : input.price,
                // Added compareAtPrice support
                compareAtPrice:
                  input.pricingType === "FREE" ? 0 : input.compareAtPrice,
                accessDuration:
                  input.pricingType === "ONE_TIME"
                    ? input.accessDuration
                    : null,
                accessDurationDays:
                  input.pricingType === "ONE_TIME" &&
                  input.accessDuration === "LIMITED"
                    ? input.accessDurationDays
                    : null,
                // Changed from recurringInterval
                recurringDays:
                  input.pricingType === "RECURRING"
                    ? input.recurringDays
                    : null,
                isActive: true,
                isDefault: true,
              },
            });

            // Create the junction table entry linking product to pricing plan
            await tx.productPricingPlan.create({
              data: {
                productId: input.productId,
                pricingPlanId: pricingPlan.id,
                isDefault: true,
              },
            });
          }

          // 2. Update the product with legacy price fields for backward compatibility
          const updatedProduct = await tx.product.update({
            where: {
              id: input.productId,
            },
            data: {
              price: input.pricingType === "FREE" ? 0 : input.price,
              compareAtPrice:
                input.pricingType === "FREE" ? 0 : input.compareAtPrice,
            },
          });

          return {
            product: updatedProduct,
            pricingPlan: pricingPlan,
            isUpdate: !!existingProductPricing, // Flag to indicate if this was an update or create
          };
        });

        return result;
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err?.message
            ? err?.message
            : "Error occurred while updating product pricing",
        });
      }
    }),

  launchProduct: privateProcedure
    .input(
      z.object({
        productId: z.string(),
        status: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const product = await ctx.prisma.product
        .update({
          where: {
            id: input.productId,
          },
          data: {
            status: input.status,
          },
        })
        .catch((err) => {
          console.log(err);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: err?.message
              ? err?.message
              : "the error in on update course settings",
          });
        });

      return { success: true, courseId: product.id };
    }),
  createProductContent: privateProcedure
    .input(
      z.object({
        productId: z.string(),
        filrUrl: z.string(),
        description: z.any(),
        subDescription: z.string(),
        thumnailUrl: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const product = await ctx.prisma.product
        .update({
          where: {
            id: input.productId,
          },
          data: {
            fileUrl: input.filrUrl,
            description: JSON.stringify(input.description),
            subDescription: input.subDescription,
            thumbnailUrl: input.thumnailUrl,
            title: input.name,
          },
        })
        .catch((err) => {
          console.log(err);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: err?.message
              ? err?.message
              : "the error in on update product content",
          });
        });

      return { success: true, courseId: product.id };
    }),
};
