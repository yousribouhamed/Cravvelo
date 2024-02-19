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
  createCoupon: privateProcedure
    .input(
      z.object({
        type: z.string(),
        amount: z.string(),
        duration: z.string(),
        months: z.string(),
        usage_limits: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get today's date
      const today = new Date();
      // Create a new date object with the same month and day but the year 3000
      const futureDate = new Date(3000, Number(input?.months), today.getDate());
      try {
        await ctx.prisma.coupon.create({
          data: {
            accountId: ctx.account.id,
            code: `${
              ctx.user.firstName ? ctx.user.firstName : "academia"
            }_${uuidv4().replace(/-/g, "").slice(0, 10)}`,
            discountAmount: Number(input?.amount),
            discountType:
              input?.type === "VALUE" ? "FIXED_AMOUNT" : "PERCENTAGE",
            expirationDate: futureDate,
            isActive: true,
            usageCount: 0,
            usageLimit: Number(input?.usage_limits),
          },
        });
      } catch (err) {
        console.error(err);
        console.error("something went wrong in create coupon api route");
      }
    }),
  archiveCoupon: privateProcedure
    .input(
      z.object({
        coupon_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const coupon = await ctx.prisma.coupon.update({
        where: {
          id: input.coupon_id,
        },
        data: {
          isArchive: true,
        },
      });
      return coupon;
    }),
};
