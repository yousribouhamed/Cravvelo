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
        price: z.number(),
        compairAtPrice: z.number(),
      })
    )

    .mutation(async ({ input, ctx }) => {
      const product = await ctx.prisma.product
        .update({
          where: {
            id: input.productId,
          },
          data: {
            price: input.price,
            compareAtPrice: input.compairAtPrice,
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

      return product;
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
            filrUrl: input.filrUrl,
            description: JSON.stringify(input.description),
            subDescription: input.subDescription,
            thumnailUrl: input.thumnailUrl,
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
