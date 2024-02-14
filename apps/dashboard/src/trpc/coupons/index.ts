import { z } from "zod";
import { privateProcedure } from "../trpc";

export const coubons = {
  getAllCoupons: privateProcedure.query(async ({ ctx, input }) => {
    const allCoupons = await ctx.prisma.coupon.findMany({
      where: {
        accountId: ctx.account.id,
      },
    });

    return allCoupons;
  }),

  createCoupon: privateProcedure
    .input(
      z.object({
        title: z.string(),
        accountId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {}),
};
