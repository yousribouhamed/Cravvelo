import { z } from "zod";
import { privateProcedure } from "../trpc";
import { v4 as uuidv4 } from "uuid";

export const coubons = {
  getAllCoupons: privateProcedure.query(async ({ ctx, input }) => {
    const allCoupons = await ctx.prisma.coupon.findMany({
      where: {
        accountId: ctx.account.id,
      },
    });

    return allCoupons;
  }),

  createCoupon: privateProcedure.mutation(async ({ ctx, input }) => {
    // Get today's date
    const today = new Date();
    // Create a new date object with the same month and day but the year 3000
    const futureDate = new Date(3000, today.getMonth(), today.getDate());
    await ctx.prisma.coupon.create({
      data: {
        accountId: ctx.account.id,
        code: uuidv4().replace(/-/g, ""),
        discountAmount: 100,
        discountType: "PERCENTAGE",
        expirationDate: futureDate,
        isActive: true,
        usageCount: 0,
        usageLimit: 1,
      },
    });
  }),
};
