import { privateProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "database/src";

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
};
