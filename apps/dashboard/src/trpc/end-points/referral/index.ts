import { z } from "zod";
import { privateProcedure } from "../../trpc";

export const referral = {
  getAllSubscribers: privateProcedure.query(async ({ ctx, input }) => {
    const allSubscribers = await ctx.prisma.referral.findMany({
      where: {
        accountId: ctx.account.id,
      },
    });

    return allSubscribers;
  }),

  enableReferal: privateProcedure
    .input(
      z.object({
        enabled: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const website = await ctx.prisma.website.update({
          where: {
            accountId: ctx.account.id,
          },

          data: {
            enableReferral: input.enabled,
          },
        });

        return website;
      } catch (err) {
        console.error(err);
      }
    }),

  disableReferal: privateProcedure.query(async ({ ctx, input }) => {
    try {
      const website = await ctx.prisma.website.update({
        where: {
          accountId: ctx.account.id,
        },

        data: {
          enableReferral: false,
        },
      });

      return website;
    } catch (err) {
      console.error(err);
    }
  }),
};
