import { privateProcedure } from "../../trpc";

export const orders = {
  getAllOrders: privateProcedure.query(async ({ ctx, input }) => {
    const allOrders = await ctx.prisma.order.findMany({
      where: {
        accountId: ctx.account.id,
      },
    });

    return allOrders;
  }),
};
