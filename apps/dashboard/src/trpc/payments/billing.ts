import { privateProcedure } from "../trpc";

export const billing = {
  getAllPayments: privateProcedure.query(async ({ ctx, input }) => {
    const allPayments = await ctx.prisma.payments.findMany({
      where: {
        accountId: ctx.account.id,
      },
    });

    return allPayments;
  }),
};
